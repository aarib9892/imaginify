'use client'
import Image from 'next/image'
import React from 'react'
import { CldImage, getCldImageUrl } from 'next-cloudinary'
import { debounce, download , getImageSize } from '@/lib/utils'
import { dataUrl } from '@/lib/utils'
import { PlaceholderValue } from 'next/dist/shared/lib/get-img-props'

const TransformedImage = ({image , type , title,transformationConfig,isTransforming,setIsTransforming,hasDownload=false}:TransformedImageProps) => {
    const downloadHandler = (e:React.MouseEvent<HTMLButtonElement>) =>{
      e.preventDefault();
      download(getCldImageUrl({
        width:image?.width,
        height:image?.height,
        src:image?.publicId,
        ...transformationConfig

      }),title)


    }
  return (
    <div className="flex flex-col gap-4">
      <div className="flex-between">
        <h3 className="h3-bold text-dark-600">Transform</h3>

        {hasDownload && (
          <button className="download-btn" onClick={downloadHandler}>
            <Image
              src="/assets/icons/download.svg"
              width={24}
              height={24}
              alt="Download"
              className="pb-6"
            />
          </button>
        )}
      </div>

      {image?.publicId && transformationConfig  ? (
        <div className="relative">
         
          <CldImage
            width={getImageSize(type, image, "width")}
            height={getImageSize(type, image, "height")}
            src={image?.publicId}
            alt="image"
            sizes={"(max-width : 767px) 100vw , 50vw"}
            placeholder={dataUrl as PlaceholderValue}
            className="media_uploader-cldImage"
            onLoad={() => {
              setIsTransforming && setIsTransforming(false);
            }}
            onError={() => {
              debounce(() => {
                setIsTransforming && setIsTransforming(false);
              }, 8000)();
            }}
            {...transformationConfig}
          />
          {isTransforming && (
            <div className="transforming-loader">
              <Image
                src="/assets/icons/spinner.svg"
                width={50}
                height={50}
                alt="spinner..."
              />
              <p className="text-white/80">Please Wait ...</p>
            </div>
          )}
        </div>
      ) : (
        <div className="transformed-placeholder">TransformedImage</div>
      )}
    </div>
  );
}

export default TransformedImage