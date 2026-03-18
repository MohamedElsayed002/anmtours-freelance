"use client"

import dynamic from 'next/dynamic'
import { useInView } from 'react-intersection-observer'
import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'

// Dynamic import for Videos component
const Videos = dynamic(() => import('./videos').then(mod => mod.Videos), {
    loading: () => <p>Loading testimonials videos...</p>,
    ssr: false,
})

export const Testimonals = () => {

    const t = useTranslations()

    const { ref, inView } = useInView({
        triggerOnce: true,
        threshold: 0.2,
    })

    const [loadVideos, setLoadVideos] = useState(false)

    useEffect(() => {
        if (inView) {
            setLoadVideos(true)
        }
    }, [inView])

    return (
        <section ref={ref} className="p-20 max-w-7xl mx-auto">
            <div className="flex justify-center items-center flex-col">
                <h2>{t("testimonials")}</h2>
                <p className='mb-5 text-sm font-semibold text-gray-500'>
                    {t("testimonials-descriptions")}
                </p>
            </div>

            <div className="videos">
                {loadVideos ? <Videos /> : <p>Loading videos...</p>}
            </div>

            <style jsx>{`
    .testimonials {
      padding: 60px 20px;
      background: #f9fafb;
    }



    h2 {
      font-size: 32px;
      font-weight: bold;
    }

    p {
      color: #6b7280;
      margin-top: 10px;
    }
  `}</style>
        </section>
    )
}