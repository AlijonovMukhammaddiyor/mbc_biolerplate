import '../../styles/ad/ad.css';

export default function Ad() {
  return (
    <div className="ad__container">
      <iframe
        style={{ width: '120px', height: '600px', margin: '0' }}
        scrolling="no"
        frameBorder="0"
        src="http://ads.imbc.com/RealMedia/ads/adstream_sx.ads/www.imbc.com/mini@Frame1"
        title="광고"
        marginHeight={0}
        marginWidth={0}
      >
        <a href="http://ads.imbc.com/RealMedia/ads/click_nx.ads/www.imbc.com/mini@Frame1">
          <img
            style={{ height: '600px', width: '120px' }}
            src="http://ads.imbc.com/RealMedia/ads/adstream_nx.ads/www.imbc.com/mini@Frame1"
            alt="광고"
          />
        </a>
      </iframe>
    </div>
  );
}
