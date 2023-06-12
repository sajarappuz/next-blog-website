import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { remark } from 'remark'
import html from 'remark-html'

const postDirectory = path.join(process.cwd(),'blogposts')
//process.cwd returns current directory to nodejs
export function getSortedPostsData(){
    const fileNames = fs.readdirSync(postDirectory);
    const allPostsData = fileNames.map((fileName)=>{
        const id = fileName.replace(/\.md$/,'');//remove .md from filename to get id
        
        const fullPath = path.join(postDirectory,fileName);
        const fileContents = fs.readFileSync(fullPath,'utf8')

        const matterResult = matter(fileContents);

        const blogpost : BlogPost ={
            id,
            title: matterResult.data.title,
            date: matterResult.data.date,
        }
        return blogpost
    });
    return allPostsData.sort((a,b)=>a.date < b.date? 1: -1);
}

export async function getPostData(id:string){
    const fullPath = path.join(postDirectory,`${id}.md`);
    const fileContents = fs.readFileSync(fullPath,'utf8');

    const matterResult = matter(fileContents);

    const processedContent = await remark()
    .use(html)
    .process(matterResult.content);

    const contentHtml = processedContent.toString();
    const blogPostWithHTML : BlogPost & {contentHtml : string} = {
            id,
            title: matterResult.data.title,
            date: matterResult.data.date,
            contentHtml,

    }
    return blogPostWithHTML
}