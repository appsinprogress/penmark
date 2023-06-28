import { Pre } from '../components/nextra/Nextra-Pre'
import { CompatibleSSGCard, HowToSSGSelector, HowItWorksStep, HowToStepSelector, SectionTitle, FeaturesTitle, FeaturesDescription } from './HomePageComponents'

const howToSSGConfigs = {
    nextjs: {
        login: {
            filename: "login.tsx",
            code: 
`import Script from "next/script"

export default function Login(){
    return(
        <>
            <Script type="module" src="http://localhost:9000/LoginClient.js"/>
        </>
    )
}`
        },
        drafts: {
            filename: "drafts.tsx",
            code: "This is a test snippet"
        },
        posts: {
            filename: "posts.tsx",
            code: 
`import Script from "next/script"

export default function Login(){
    return(
        <>
            <Script type="module" src="http://localhost:9000/LoginClient.js"/>
        </>
    )
}`
        }
    }
}

export default function HomePage() {
    return (
        <div className="max-w-7xl m-auto">
            <div id="hero" className="px-6 m-auto my-16">
                <div className="text-6xl leading-[1.2em] font-semibold text-center  max-w-5xl m-auto">
                    Penmark is an <span
                        style={{
                            fontFamily: "Architects Daughter",
                            fontWeight: "normal",
                        }}
                    >embeddable</span> CMS for your Markdown-based,
                    GitHub-backed content sites
                </div>
                <div className="text-zinc-500 text-3xl text-center leading-[1.3em] max-w-3xl m-auto my-6">
                    Edit your content directly from your site, wherever you are, and Penmark
                    takes care of the rest!
                </div>
                <div className="flex justify-center space-x-4 text-2xl">
                    <button className="border-2 border-black font-medium shadow-md px-8 py-2 rounded-full">Get Started</button>
                    <button className="border-2 border-black font-medium shadow-md px-8 py-2 rounded-full">Watch Demo</button>
                </div>
            </div>
            <div id="hero-image">
                <img src="https://images.unsplash.com/photo-1515879218367-8466d910aaa4?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8Y2FyZWVyfGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&w=1000&q=80"></img>
            </div>
            <div id="hero-compatibility" className="my-32">
                <div
                    style={{
                        fontFamily: "Architects Daughter",
                    }}

                    className="text-[2em] my-4"
                >
                    Compatible with your favorite static site generators
                </div>
                <div className="flex">
                    <CompatibleSSGCard>
                        <img src="/ssg_logos/nextjs.png"></img>
                    </CompatibleSSGCard>
                    <CompatibleSSGCard>
                        <img src="/ssg_logos/jekyll.svg"></img>
                    </CompatibleSSGCard>
                    <CompatibleSSGCard>
                        <img src="/ssg_logos/hugo.png"></img>
                    </CompatibleSSGCard>
                    <CompatibleSSGCard>
                        <img src="/ssg_logos/astro.png"></img>
                    </CompatibleSSGCard>
                    <CompatibleSSGCard>
                        Any Markdown based SSG
                    </CompatibleSSGCard>
                </div>
            </div>
            <div id="hero-howto" className="my-64">
                <SectionTitle>
                    Add to your site in 5 minutes
                </SectionTitle>
                <div className="my-4">
                    <div id="hero-howto-ssgselector" className="pl-42 flex justify-center space-x-4">
                        <HowToSSGSelector>
                            <img src="/ssg_logos/nextjs.png"></img>
                        </HowToSSGSelector>
                        <HowToSSGSelector>
                            <img src="/ssg_logos/jekyll.svg"></img>
                        </HowToSSGSelector>
                        <HowToSSGSelector>
                            <img src="/ssg_logos/hugo.png"></img>
                        </HowToSSGSelector>
                        <HowToSSGSelector>
                            <img src="/ssg_logos/astro.png"></img>
                        </HowToSSGSelector>
                    </div>
                    <div className="grid grid-cols-5 grid-rows-1 my-6 w-full">
                        <div id="hero-howto-step">
                            <HowToStepSelector>Login</HowToStepSelector>
                            <HowToStepSelector>Drafts</HowToStepSelector>
                            <HowToStepSelector>Posts</HowToStepSelector>
                        </div>
                        <div id="hero-howto-snippet"
                            //tailwind code for a code snippet
                            className="rounded-md col-span-4 border rounded-lg shadow-md py-4"
                        >
                            <Pre filename="login.tsx (new file)">
                                This is a test snippet
                            </Pre>
                        </div>
                    </div>
                </div>
            </div>
            <div id="hero-howitworks" className="my-64">
                <SectionTitle>
                    How it works
                </SectionTitle>
                <div className="grid grid-cols-2 grid-rows-3 grid-flow-col gap-8">
                    <HowItWorksStep>
                        <div>
                            Login
                        </div>
                        <div>
                            Enable the Penmark GitHub application to access to your repository contents
                        </div>
                    </HowItWorksStep>
                    <HowItWorksStep>
                        <div>
                            Make edits on Penmark & save
                        </div>
                        <div>
                            Changes are committed to your drafts folder in your repository.
                        </div>
                    </HowItWorksStep>
                    <HowItWorksStep>
                        <div>
                            Press publish
                        </div>
                        <div>
                            Penmark saves to your posts folder, triggering a new build of your site.
                        </div>
                    </HowItWorksStep>
                    <div
                        //tailwind class for centering text in the middle, with a border
                        className="border rounded-lg shadow-md p-8 col-span-2 row-span-3 flex justify-center items-center"
                    >
                        A video goes here
                    </div>
                </div>

            </div>
            <div id="hero-features" className="my-64">
                <SectionTitle>
                    The editing experience you’ve always wished for
                </SectionTitle>
                <div className="grid grid-cols-6 grid-rows-6 grid-flow-col gap-8">
                    <div className="border rounded-lg shadow-md p-8 col-span-3 row-span-4">
                        <FeaturesTitle>
                            WYSIWYG or Markdown: You choose!
                        </FeaturesTitle>
                    </div>
                    <div
                    className="border rounded-lg shadow-md p-8 col-span-3 row-span-2"
                    >
                        <FeaturesTitle>
                            GitHub backed
                        </FeaturesTitle>
                        <FeaturesDescription>
                            All changes are synced with your repository
                        </FeaturesDescription>
                    </div>
                    <div className="border rounded-lg shadow-md p-8 col-span-3 row-span-2">
                        <FeaturesTitle>
                            Edit anywhere
                        </FeaturesTitle>
                        <FeaturesDescription>
                            Edit with the device at your fingertips when inspiration strikes
                        </FeaturesDescription>
                    </div>
                    <div className="border rounded-lg shadow-md p-8 col-span-3 row-span-4">
                        <FeaturesTitle>
                            Embedded within your site
                        </FeaturesTitle>
                        <FeaturesDescription>
                            No need for external sites or desktop tools
                        </FeaturesDescription>
                    </div>
                </div>
                
            </div>
        </div>
    )
}