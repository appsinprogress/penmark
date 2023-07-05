import { useState } from 'react';
import { Pre } from '../components/nextra/Nextra-Pre'
import { CompatibleSSGCard, HowToSSGSelector, HowItWorksStep, HowToStepSelector, SectionTitle, FeaturesTitle, FeaturesDescription } from './HomePageComponents'
import {howToSSGConfigs} from './HomePageSSGConfigs';

export default function HomePage() {
    const [selectedSSG, setSelectedSSG] = useState(Object.keys(howToSSGConfigs)[0]);
    const [selectedStep, setSelectedStep] = useState(Object.keys(howToSSGConfigs[Object.keys(howToSSGConfigs)[0]].files)[0]);
    const [howItWorksStep, setHowItWorksStep] = useState(0);
    
    return (
        <div className="max-w-7xl m-auto px-6">
            <div id="hero" className="sm:px-10 m-auto my-14">
                <div className="md:text-5xl sm:text-4xl text-3xl leading-[1.2em] font-semibold text-center  max-w-5xl m-auto">
                    Penmark is an <span
                        style={{
                            fontFamily: "Architects Daughter",
                            fontWeight: "normal",
                        }}
                    >embeddable</span> CMS for your Markdown-based,
                    GitHub-backed sites
                </div>
                <div className="md:text-2xl sm:text-xl text-lg text-zinc-500 text-center leading-[1.3em] max-w-3xl m-auto my-6">
                    Edit your content directly from your site, wherever you are, and your changes are saved to your repository.
                </div>
                <div className="flex justify-center space-x-4 sm:text-lg text-md">
                    <button className="border-2 border-black font-medium shadow-md sm:px-8 px-4 py-2 rounded-full">Get Started</button>
                    <button className="border-2 border-black font-medium shadow-md sm:px-8 px-4 py-2 rounded-full">Watch Demo</button>
                </div>
            </div>
            <div id="hero-image" >
                <img src="penmark-hero.png"></img>
            </div>
            <div id="hero-compatibility" className="mt-16 mb-24 md:px-10">
                <div className="md:text-3xl text-xl my-4 font-semibold ">
                    Compatible with your favorite static site generators
                </div>
                <div className="flex justify-center">
                    <CompatibleSSGCard className="">
                        <img src="/ssg_logos/nextjs.png"></img>
                    </CompatibleSSGCard>
                    <CompatibleSSGCard className="">
                        <img src="/ssg_logos/jekyll.svg"></img>
                    </CompatibleSSGCard>
                    <CompatibleSSGCard className="">
                        <img src="/ssg_logos/hugo.png"></img>
                    </CompatibleSSGCard>
                    <CompatibleSSGCard className="">
                        <img src="/ssg_logos/astro.png"></img>
                    </CompatibleSSGCard>
                    <CompatibleSSGCard className="hidden md:block">
                        <div className='flex items-center'>
                            Any Markdown based SSG
                        </div>
                    </CompatibleSSGCard>
                </div>
            </div>
            <div id="hero-howto" className="md:my-48 my-40">
                <SectionTitle>
                    Add to your site in 5 minutes
                </SectionTitle>
                <div className="my-4">
                    <div id="hero-howto-ssgselector" className="pl-42 flex space-x-4">
                        {Object.keys(howToSSGConfigs).map((ssg, index) => {
                            return (
                                <HowToSSGSelector
                                    key={index}
                                    selected={selectedSSG === Object.keys(howToSSGConfigs)[index]}
                                    onClick={() => {
                                        setSelectedSSG(Object.keys(howToSSGConfigs)[index]);
                                        setSelectedStep(Object.keys(howToSSGConfigs[Object.keys(howToSSGConfigs)[index]].files)[0]);
                                    }
                                }>
                                    <img src={howToSSGConfigs[ssg].logoPath}></img>
                                </HowToSSGSelector>
                            )
                        })}
                    </div>
                    <div className='flex mx-2'>
                        {Object.keys(howToSSGConfigs[selectedSSG].files).map((step, index) => {
                            console.log(selectedSSG)
                            console.log(howToSSGConfigs[selectedSSG].files)
                            console.log('step', step)
                            return (
                                <HowToStepSelector
                                    key={index}
                                    selected={selectedStep === Object.keys(howToSSGConfigs[selectedSSG].files)[index]}
                                    onClick={() => {
                                        console.log('setting selected step', Object.keys(howToSSGConfigs[selectedSSG].files)[index])
                                        setSelectedStep(Object.keys(howToSSGConfigs[selectedSSG].files)[index]);
                                    }
                                }>
                                    {`${index+1}. ${step}`}
                                </HowToStepSelector>
                            )
                        })}
                    </div>
                    <div id="hero-howto-snippet"
                        //tailwind code for a code snippet
                        className="rounded-md sm:col-span-4 col-span-3 row-span-3 rounded-xl shadow-md text-sm"
                    >
                        <Pre filename={howToSSGConfigs[selectedSSG].files[selectedStep]['filename']}>
                            {howToSSGConfigs[selectedSSG].files[selectedStep]['code']}
                        </Pre>
                    </div>
                </div>
            </div>
            <div id="hero-howitworks" className="md:my-48 my-40">
                <SectionTitle>
                    How it works
                </SectionTitle>
                <div className="grid grid-cols-3 grid-rows-3 md:grid-flow-col grid-flow-row md:gap-4 gap-2 md:text-base text-sm">
                    <HowItWorksStep onClick={
                        () => {
                            setHowItWorksStep(0);
                        }
                    }>
                        <div className='font-semibold'>
                            Login
                        </div>
                        <div className='md:block hidden text-slate-500'>
                            Enable the Penmark GitHub application to access to your repository contents
                        </div>
                    </HowItWorksStep>
                    <HowItWorksStep onClick={
                        () => {
                            setHowItWorksStep(1);
                        }
                    }>
                        <div className='font-semibold'>
                            Make edits & save
                        </div>
                        <div className='md:block hidden text-slate-500'>
                            Changes are committed to your drafts folder in your repository.
                        </div>
                    </HowItWorksStep>
                    <HowItWorksStep onClick={() => {setHowItWorksStep(2)}}>
                        <div className='font-semibold'>
                            Press publish
                        </div>
                        <div className='md:block hidden text-slate-500'>
                            Penmark saves to your posts folder, triggering a new build of your site.
                        </div>
                    </HowItWorksStep>
                    <div
                        //tailwind class for centering text in the middle, with a border
                        className="border rounded-lg shadow-md p-8 md:col-span-2 col-span-3 row-span-3 flex justify-center items-center"
                    >
                        {
                            howItWorksStep === 0 ? (
                                <img src="/screen_recordings/login.gif"></img>
                            ) : howItWorksStep === 1 ? (
                                <img src="/screen_recordings/edit-save.gif"></img>
                            ) : (
                                <img src="/screen_recordings/publish.gif"></img>
                            )
                        }
                    </div>
                </div>

            </div>
            <div id="hero-features" className="md:my-48 my-40">
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