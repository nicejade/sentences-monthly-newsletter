const articleBeginStr = `人生最曼妙的风景，是**内心的淡定与从容**。[曼妙句子](https://read.lovejade.cn/)，旨在**云集世间摇曳生姿的文字**，或\`情感\`、或\`唯美\`、或\`修身\`、或\`励志\`、或\`哲学\`、或\`娱乐\`，拳拳真情，精心择选，总有荡漾你心的那一言。

除了网站外，有将收录的内容，以一月为间隔，整理为篇，月末定期发布，命名为《高品质有意思美句月刊》；首发于微信公众号[曼妙句子](https://mp.weixin.qq.com/mp/appmsgalbum?__biz=Mzk0NzI5NjQ3Mg==&action=getalbum&album_id=2103726193429512196)、博客[晚晴幽草轩](https://www.jeffjade.com)，以及[悠然宜想亭](https://forum.lovejade.cn/)社区；此一键生成脚本基于 [Deno](https://nicelinks.site/post/602d30aad099ff5688618591) 编写，并在 [Github 开源](https://github.com/nicejade/sentences-monthly-newsletter)。\n\n`

const articleEndStr = `情不知所起，一往而深。那些与旁人说来脸红的绰号暱称、轻灵的诗意，和深刻的激动，像筛子一般，将文字抖出松弛微醺的质感，历久弥新。任时世流转，风华变迁，在这美妙的质感前，循迹而去，仍能感观：那些在文字中留鲜的岁月，一段段永不衰老的情缘；隔著时空漫漫，跨越千山万水，蹁跹而来，带给我们不曾褪色的悸动。对[曼妙句子](http://read.lovejade.cn/)感兴趣的朋友，可通过 [Web 网站](http://read.lovejade.cn/)，[公众号](https://mp.weixin.qq.com/mp/appmsgalbum?__biz=Mzk0NzI5NjQ3Mg==&action=getalbum&album_id=2103726193429512196)等渠道进行访问。`

const queryString = (url: string, query: any) => {
  let str = []
  for (let key in query) {
    str.push(key + '=' + query[key])
  }
  let paramStr = str.join('&')
  return paramStr ? `${url}?${paramStr}` : url
}

const getMonthlyNumber = (targetLength: number) => {
  const firstWeekDateTime = new Date('2021-09-30').getTime() 
  const currentDateTime = (new Date()).getTime()
  const offsetDateTime = currentDateTime - firstWeekDateTime
  const offsetNumber = Math.round(offsetDateTime / (30 * 86400000))
  const weeklyNumber = offsetNumber.toString().padStart(targetLength, '0')
  return weeklyNumber
}

const writeToMdFile = (articleStr: string) => {
  const monthlyNumber = getMonthlyNumber(3)
  Deno.writeTextFile(`./docs/monthly-${monthlyNumber}.md`, articleStr)
}

const fetchNicelinks = () => {
  const params = {
    pageCount: 1,
    pageSize: 30,
    sortType: -1,
    sortTarget: 'createTime',
    active: true
  }
  const baseUrl = 'https://nicelinks.site/api/getSentences'
  const targetPath = queryString(baseUrl, params)
  return fetch(targetPath)
  .then(response => response.json())
  .then(result => result.value)
}

const getTargetContent = (sourceArr: Array<object>) => {
  const currentTime = (new Date()).getTime()
  const offsetTime = 86400000 * 30
  const lastMonth = new Date(currentTime - offsetTime)
  return sourceArr.filter((item: any) => {
    return new Date(item.createTime) > lastMonth
  })
}

const genArticleStr = (sourceArr: Array<object>) => {
  const articlePictureMd = `![高品质美句月刊第 ${getMonthlyNumber(1)} 期 - 曼妙句子](https://image.nicelinks.site/jpg/nice-links-${getMonthlyNumber(3)}.jpg)\n\n`

  let articleStr: string = articleBeginStr + articlePictureMd
  for (let key in sourceArr) {
    const item: any = sourceArr[key]
    const fromUrl = `https://read.lovejade.cn/p/${item._id}`
    const tempTemp = `[${item.content}](${fromUrl}) \n\n`
    articleStr += tempTemp
  }
  return articleStr + articleEndStr
}

const main = () => {
  fetchNicelinks().then(result => {
    const targetContent = getTargetContent(result)
    const articleStr = genArticleStr(targetContent)
    writeToMdFile(articleStr)
    console.log(`🎉祝贺主公：本期「优质网站同好者周刊」已经为您一键生成.`)
  })
}

main()