const nextJSCodeSnippetLogin = `import { useEffect, useRef } from 'react'

export default function Login() {    

    const penmarkRef = useRef(null)

    useEffect(() => {
        const script = document.createElement('script');
        script.setAttribute('type', 'module');
        script.setAttribute('src', 'https://penmark.appsinprogress.com/dist/LoginClient.js');
    
        penmarkRef.current.appendChild(script);

        if(window.penmarkLoginInit) {
            window.penmarkLoginInit();
        }
    }, []);
    
    return (
        <>  
            <div ref={penmarkRef}></div>
        </>
    );
}
`;

const nextJSCodeSnippetDrafts = `import { useRef, useEffect } from 'react'

export default function Index({ allPosts }: Props) {
    [...]
  
    const penmarkRef = useRef(null)
  
    //inject penmark script
    useEffect(() => { 
        const script = document.createElement('script');
        script.setAttribute('type', 'module');
        script.setAttribute('src', 'https://penmark.appsinprogress.com/dist/DraftsClient.js');
        script.setAttribute('draftsFolder', '_drafts');
        script.setAttribute('postsFolder', '_posts');
        script.setAttribute('imagesFolder', 'public/assets/blog');
        script.setAttribute('githubUsername', 'penmark-cms');
        script.setAttribute('githubRepoName', 'penmark-nextjs-example');
        script.async = true;
    
        if (penmarkRef.current) {
            penmarkRef.current.appendChild(script);
        }
    
        if(window.penmarkDraftsInit) {
            window.penmarkDraftsInit();
        }
    }, [penmarkRef]);
  
    return (
        <>
            [...]
                <div ref={penmarkRef}></div>
            [...]
        </>
)}`

const nextJSCodeSnippetPosts = `import { useRef, useEffect } from 'react'

export default function Post() {
    [...]

    const penmarkRef = useRef(null)

    useEffect(() => { 
        const script = document.createElement('script');
        script.setAttribute('type', 'module');
        script.setAttribute('src', 'https://penmark.appsinprogress.com/dist/PostClient.js');
        script.setAttribute('draftsFolder', 'drafts');
        script.setAttribute('postsFolder', '_posts');
        script.setAttribute('imagesFolder', 'public/assets/blog');
        script.setAttribute('githubUsername', 'penmark-cms');
        script.setAttribute('githubRepoName', 'penmark-nextjs-example');
        script.setAttribute('postfilepath', \`_posts/\${post.slug}.md\`);
        penmarkRef.current.appendChild(script);

        if(window.penmarkPostInit) {
            window.penmarkPostInit();
        }
    }, []);
    
    return (
        <>
            [...]
                <div ref={penmarkRef}></div>
            [...]
        </>
    )
}`;

const jekyllCodeSnippetLogin = `<body>
    <script 
        type="module" 
        src="https://penmark.appsinprogress.com/dist/LoginClient.js"
    />
</body>







`;

const jekyllCodeSnippetDrafts = `[...]

<script 
    type="module" 
    src="https://penmark.appsinprogress.com/dist/DraftsClient.js"
    draftsFolder="_drafts"
    postsFolder="_posts"
    imagesFolder="uploads"
    githubUsername="penmark-cms"
    githubRepoName="penmark-jekyll-example"
></script>

[...]`;

const jekyllCodeSnippetPosts = `[...]

<script 
    type="module" 
    src="https://penmark.appsinprogress.com/dist/PostClient.js" 
    postfilepath="{{ page.path }}"
    draftsFolder="_drafts"
    postsFolder="_posts"
    imagesFolder="uploads"
    githubUsername="penmark-cms"
    githubRepoName="penmark-jekyll-example"  
></script> 

[...]`;

const hugoCodeSnippetLogin = `<body>
    <script 
        type="module" 
        src="https://penmark.appsinprogress.com/dist/LoginClient.js"
    />
</body>







`;

const hugoCodeSnippetDrafts = `[...]

<script 
    type="module" 
    src="https://penmark.appsinprogress.com/dist/DraftsClient.js"
    draftsFolder="drafts"
    postsFolder="content/posts"
    imagesFolder="static/images"
    githubUsername="thomasgauvin"
    githubRepoName="hugo-penmark-example"
></script>

[...]`;

const hugoCodeSnippetPosts = `[...]

<script 
    type="module" 
    src="https://penmark.appsinprogress.com/dist/PostClient.js"
    draftsFolder="drafts"
    postsFolder="content/posts"
    imagesFolder="static/images"
    githubUsername="thomasgauvin"
    githubRepoName="hugo-penmark-example"
    postfilepath="{{ $filePath }}"
></script>

[...]`;

export const howToSSGConfigs = {
    NextJS: {
        logoPath: "/ssg_logos/nextjs.png",
        files: {
            Login: {
                filename: "login.tsx",
                code: nextJSCodeSnippetLogin
            },
            Drafts: {
                filename: "drafts.tsx",
                code: nextJSCodeSnippetDrafts
            },
            Posts: {
                filename: "posts.tsx",
                code: nextJSCodeSnippetPosts
            }
        }
    },
    Jekyll: {
        logoPath: "/ssg_logos/jekyll.svg",
        files: {
            Login: {
                filename: "login.html",
                code: jekyllCodeSnippetLogin
            },
            Drafts: {
                filename: "home.html",
                code: jekyllCodeSnippetDrafts
            },
            Posts: {
                filename: "post.html",
                code: jekyllCodeSnippetPosts
            }
        }
    },
    Hugo: {
        logoPath: "/ssg_logos/hugo.png",
        files: {
            Login: {
                filename: "login.html",
                code: hugoCodeSnippetLogin
            },
            Drafts: {
                filename: "list.html",
                code: hugoCodeSnippetDrafts
            },
            Posts: {
                filename: "single.html",
                code: hugoCodeSnippetPosts
            }
        }
    }
} 