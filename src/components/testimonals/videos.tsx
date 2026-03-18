'use client'

export const Videos = () => {
  const videoList = [
    {
      id: 1,
      // title: 'Client Testimonial 1',
      url: 'https://04eml5nh7y.ufs.sh/f/DFEIsbZTSOxgsp7dwHyPCD7rXAtZKqu03BFUy9QjRIMe6zYL',   // ✅ remove /public
      poster: '/video-1.png',
    },
    {
      id: 2,
      // title: 'Client Testimonial 2',
      url: 'https://04eml5nh7y.ufs.sh/f/DFEIsbZTSOxgdJaNtRDn7ia8D4s2oIrqOuyJwz0lxW1tcfPN',
      poster: '/video-2.png',
    },
    {
      id:3,
      // title: 'Client Testimonial 3',
      url: 'https://04eml5nh7y.ufs.sh/f/DFEIsbZTSOxgrqryntOOolBLH4qySVgwCTF21rbhavMntzx3',
      poster: '/video-3.png'
    }
  ]

  return (
    <div className="videos-grid">
      {videoList.map((video) => (
        <div key={video.id} className="video-card">
          <div className="video-wrapper">
            <video
              controls
              preload="metadata"
              poster={video.poster || '/default-thumb.jpg'}
              className="video"
              src={video.url} // ✅ use directly here
            >
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      ))}

      <style jsx>{`
        .videos-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 24px;
        }

        .video-card {
          background: #fff;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 10px 25px rgba(0,0,0,0.08);
          transition: transform 0.3s ease;
        }

        .video-card:hover {
          transform: translateY(-5px);
        }

        .video-wrapper {
          position: relative;
          width: 100%;
          height: 500px;
          background: #000;
        }

        .video {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        h4 {
          padding: 12px;
          font-size: 16px;
          font-weight: 600;
        }
      `}</style>
    </div>
  )
}