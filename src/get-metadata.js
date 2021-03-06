// Note: Please do not use JSDOM or any other external library/package (sorry)
/*
type Metadata = {
  url: string;
  siteName: string;
  title: string;
  description: string;
  keywords: string[];
  author: string;
};
*/

/**
 * Gets the URL, site name, title, description, keywords, and author info out of the <head> meta tags from a given html string.
 * 1. Get the URL from the <meta property="og:url"> tag.
 * 2. Get the site name from the <meta property="og:site_name"> tag.
 * 3. Get the title from the the <title> tag.
 * 4. Get the description from the <meta property="og:description"> tag or the <meta name="description"> tag.
 * 5. Get the keywords from the <meta name="keywords"> tag and split them into an array.
 * 6. Get the author from the <meta name="author"> tag.
 * If any of the above tags are missing or if the values are empty, then the corresponding value will be null.
 * @param html The complete HTML document text to parse
 * @returns A Metadata object with data from the HTML <head>
 */

// export default function getMetadata(html) {
//   console.log({ html });
const oneLineHtml= (data) => {
  let isOpen = false;
  let newHtml = [];
  let _line = "";

  data.forEach(line => {
    if (line[0] == '<' && line[line.length - 1] == '>') {
      newHtml.push(line);
    }
    else if (line[line.length - 1] == '>') {
      _line += " " + line.trim();
      newHtml.push(_line);
      _line = "";
    }
    else {
      _line += " " + line.trim();
    }
  })

  return newHtml;
}
const getMetaResult = (data) => {

  var result = [];
  result["sitename"] = ""
  result["url"] = ""
  result["description"] = ""
  result["title"] = ""
  result["author"] = ""
  result["keywords"] = ""


  if (typeof data === 'string'){

    let tags = data.trim().split("\n");

    tags = oneLineHtml(tags);
    for (let i = 0; i < tags.length; i++) {
      if (tags[i].match('property="og:site_name"')) {

        let value = tags[i].trim().split(/meta\sproperty\=\"og\:site_name\"\scontent\=\"([A-Za-z0-9 _]*)\"/);

        if(value === ""){
          result["sitename"] = ""

        }else{
          result["sitename"] = value
              .join("")
              .replace(/[^\w\s]/gi, "")
              .trim();
        }


      }
      if (tags[i].match('property="og:url"')) {

        let value = tags[i]
            .trim()
            .split(/meta\sproperty\=\"og\:url"\"\scontent\=\"([A-Za-z0-9 _]*)\"/)
            .toString();
        if(value.match(/\bhttps?:\/\/\S+/gi)){
          let target = value.match(/\bhttps?:\/\/\S+/gi);
          result["url"] = target.join("").replace(/">/g, "").replace(/\"/g, "");
        }else{
          result["url"] = ""
        }
      }
      if (tags[i].match('property="og:description"')) {
        let value = tags[i].trim()
            .split(/meta\sproperty\=\"og\:description"\"\scontent\=\"\"/)
            .toString();

        if(value === ""){
          result["description"] = ""
        }else{
          let string =   value.replace(/<meta property="og:description" content="/g, "")
              .replace(/<meta property="og:description" content="/g, "")
              .replace("/>", "").split('"')
          result["description"] = string[0]
              .replace(/<meta property="og:description" content="/g, "")
              .replace("/>", "")
              .replace(">", "")
              .replace(/\"/g, "")
        }
      }


      if (tags[i].match('<title\s*.*>\s*.*<\/title>')||tags[i].match('<TITLE\s*.*>\s*.*<\/TITLE>')) {

        let value = tags[i].replace("<title>", "").replace("</title>", "").replace("<TITLE>", "").replace("</TITLE>", "");
        if(value === ""){
          result["title"] = ""
        }else {
          result["title"] = value.trim();
        }
      }
      if (tags[i].match('name="author"')) {
        let value = tags[i]
            .trim()
            .split(/meta\sname\=\"author"\"\scontent\=\"([A-Za-z0-9 _]*)\"/)
            .toString();
        if(value === ""){
          result["author"] = ""
        }else {
          result["author"] = value
              .replace(/<meta name="author" content=/g, "")
              .replace(/>/g, "")
              .replace(/[^\w\s]/gi, "")
              .trim();
        }
      }

      if (tags[i].match('name="keywords"')) {
        let value = tags[i].trim().split(/meta\sname\=\"keywords\"\scontent\=\"\"/);

        result["keywords"] = value
            .join("")
            .replace(/<meta name="keywords" content=/g, "")
            .replace(/>/g, "")
            .replace(/</g, "")
            .replace(/\"/g, "")
            .replace('/', "")
            .trim()
            .split(",");
      }
    }
  }else{
    result = null;
  }
  return result;
}
export default function getMetadata(htmlExBasic) {
  let data = htmlExBasic;
  let result = "";

  result = getMetaResult(data);

  if(result){
    if(result.url.trim() === "" && result.sitename.trim() === "" && result.title.trim() === "" && result.keywords.length > 0  && result.author.trim() === ""  ){

      return {
        url: "",
        siteName: "",
        title: "",
        description: "",
        keywords: [],
        author: "",
      };
    } else{
      return {
        url: result.url ? result.url.toString() : null,
        siteName: result.sitename ? result.sitename.toString() : null,
        title: result.title ? result.title : null,
        description: result.description ? result.description : null,
        keywords: result.keywords ? result.keywords : null,
        author: result.author ? result.author : null,
      };
    }

    }

  else{
    return {
      url: null,
      siteName: null,
      title: null,
      description: null,
      keywords: null,
      author: null,
    };
  }

}


