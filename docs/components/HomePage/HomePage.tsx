import { useState } from 'react';
import { Pre } from '../nextra/Nextra-Pre'
import { CompatibleSSGCard, HowToSSGSelector, HowItWorksStep, HowToStepSelector, SectionTitle, FeaturesTitle, FeaturesDescription, FeaturesImage } from './HomePageComponents'
import {howToSSGConfigs} from './HomePageSSGConfigs';
import Link from 'next/link';
import VideoDemoOverlay from '../VideoDemoOverlay/VideoDemoOverlay';

export default function HomePage() {
    const [showYouTubeVideo, setShowYouTubeVideo] = useState(false);
    const [selectedSSG, setSelectedSSG] = useState(Object.keys(howToSSGConfigs)[0]);
    const [selectedStep, setSelectedStep] = useState(Object.keys(howToSSGConfigs[Object.keys(howToSSGConfigs)[0]].files)[0]);
    const [howItWorksStep, setHowItWorksStep] = useState(0);

    return (
        <> 
            <VideoDemoOverlay active={showYouTubeVideo} onClose={() => setShowYouTubeVideo(false)} />
            <div className="max-w-7xl m-auto px-6 relative">
                <div className="lg:block absolute hidden xl:right-[-1em] right-[1em] top-[-4em] h-20 ">
                        <div className='h-full flex'>
                            <img className="object-fill" src="/scribbles/enjoytheproject.png"></img>
                        </div>
                </div>
                <div id="hero" className="sm:px-10 m-auto mt-20 mb-14">
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
                    </div>
                    <div className="flex justify-center space-x-4 sm:text-lg text-md">
                        <Link href="/docs/gettingstarted">
                            <button className="bg-slate-900 text-white hover:bg-slate-800 hover:shadow-lg ease-in duration-100 border-2 border-slate-800 font-medium shadow-md sm:px-8 px-4 py-2 rounded-full">Get Started</button>
                        </Link>
                        <button onClick={()=>{
                            window.scrollTo(0, 0);
                            setShowYouTubeVideo(true);
                        }} className="hover:bg-slate-50 hover:shadow-lg ease-in duration-100 border-2 border-black font-medium shadow-md sm:px-8 px-4 py-2 rounded-full">Watch Demo</button>
                    </div>
                    <div className="sm:flex hidden justify-center lg:h-16 h-14 ">
                        <div className='h-full flex lg:ml-[-29.5em] lg:mt-[-0.5em] ml-[-26.5em] mt-[-1em]'>
                            <img className="object-fill" src="/scribbles/itsfreeandopensource.png"></img>
                        </div>
                    </div>
                </div>
                <div id="hero-image" className='relative'>
                    <div className="sm:block sm:absolute h-24 lg:top-[-45px] top-[-55px] left-[-30px] hidden">
                        <div className='flex h-24'>
                            <img className="object-fill" src="/scribbles/thisisyourcontentsite.png"></img>
                        </div>
                    </div>
                    <div className="sm:block sm:absolute h-[14%] top-[52%] left-[1%] hidden">
                        <div className='flex h-full'>
                            <img className="object-fill" src="/scribbles/penmarkisonlyvisibletologgedinusers.png"></img>
                        </div>
                    </div>
                    <img src="penmark-hero.png"></img>
                    <div className="sm:block sm:absolute lg:h-24 h-20 bottom-[-1.5em] right-[-1.5em] hidden">
                        <div className='flex h-full'>
                            <img className="object-fill" src="/scribbles/thiseditorpopsupasamodalwithinyourownsite.png"></img>
                        </div>
                    </div>
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
                <div id="hero-howto" className="md:my-48 my-40 md:px-10">
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
                                return (
                                    <HowToStepSelector
                                        key={index}
                                        selected={selectedStep === Object.keys(howToSSGConfigs[selectedSSG].files)[index]}
                                        onClick={() => {
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
                <div id="hero-howitworks" className="md:my-48 my-40 md:px-10 relative">
                    <SectionTitle>
                        How it works
                    </SectionTitle>
                    <div className="sm:block absolute h-24 left-[-0.2em] top-[-0.5em] hidden">
                        <div className='h-full flex'>
                            <img className="object-fill" src="/scribbles/simpleas123.png"></img>
                        </div>
                    </div>
                    <div className="grid grid-cols-3 grid-rows-3 lg:grid-flow-col grid-flow-row md:gap-6 gap-4 sm:text-base">
                        <HowItWorksStep onClick={
                            () => {
                                setHowItWorksStep(0);
                            }
                            }
                            selected={howItWorksStep === 0}
                        >
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
                            }
                            selected={howItWorksStep === 1}
                        >
                            <div className='font-semibold'>
                                Edit & save
                            </div>
                            <div className='md:block hidden text-slate-500'>
                                Changes are committed to your drafts folder in your repository.
                            </div>
                        </HowItWorksStep>
                        <HowItWorksStep onClick={() => {setHowItWorksStep(2)}}
                            selected={howItWorksStep === 2}
                        >
                            <div className='font-semibold'>
                                Press publish
                            </div>
                            <div className='md:block hidden text-slate-500'>
                                Penmark saves to your posts folder, triggering a new build of your site.
                            </div>
                        </HowItWorksStep>
                        <div
                            //tailwind class for centering text in the middle, with a border
                            className="lg:col-span-2 col-span-3 row-span-3 flex justify-center items-center"
                        >
                            {
                                howItWorksStep === 0 ? (
                                    <img src="/screen_recordings/login.gif" className='shadow-md rounded'></img>
                                ) : howItWorksStep === 1 ? (
                                    <img src="/screen_recordings/edit-save.gif" className='shadow-md rounded'></img>
                                ) : (
                                    <img src="/screen_recordings/publish.gif" className='shadow-md rounded'></img>
                                )
                            }
                        </div>
                    </div>

                </div>
                <div id="hero-features" className="md:my-48 my-40 md:px-10">
                    <SectionTitle>
                        The editing experience you’ve always wished for
                    </SectionTitle>
                    <div className="sm:grid grid-cols-6 grid-rows-3 grid-flow-col gap-4">
                        <div className="flex flex-col border rounded-lg shadow-md p-8 col-span-3 row-span-2 m-2">
                            <FeaturesTitle>
                                WYSIWYG or Markdown
                            </FeaturesTitle>
                            <FeaturesDescription>
                                You choose!
                            </FeaturesDescription>
                            <FeaturesImage>
                                <img className="object-contain" src="/features_mocks/sample-penmark-wysiwyg-toggle.png"></img>
                            </FeaturesImage>
                        </div>
                        <div
                        className="border rounded-lg shadow-md p-8 col-span-3 row-span-1 m-2"
                        >
                            <FeaturesTitle>
                                GitHub backed
                            </FeaturesTitle>
                            <FeaturesDescription>
                                All changes are synced with your repository
                            </FeaturesDescription>
                        </div>
                        <div className="border rounded-lg shadow-md p-8 col-span-3 row-span-1 m-2">
                            <FeaturesTitle>
                                Edit anywhere
                            </FeaturesTitle>
                            <FeaturesDescription>
                                Edit with the device at your fingertips when inspiration strikes
                            </FeaturesDescription>
                        </div>
                        <div className="flex flex-col border rounded-lg shadow-md p-8 col-span-3 row-span-2 m-2">
                            <FeaturesTitle>
                                Embedded within your site
                            </FeaturesTitle>
                            <FeaturesDescription>
                                No need for external sites or desktop tools
                            </FeaturesDescription>
                            <FeaturesImage>
                                <img className='object-contain' src="/features_mocks/sample-site-with-penmark.png"></img>
                            </FeaturesImage>
                        </div>
                    </div>
                    
                </div>
            </div>
        </>
    )
}