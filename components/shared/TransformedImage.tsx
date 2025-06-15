import Image from 'next/image'
import React from 'react'
import { CldImage } from 'next-cloudinary'
import { debounce } from '@/lib/utils'
import { dataUrl } from '@/lib/utils'
import { PlaceholderValue } from 'next/dist/shared/lib/get-img-props'

const TransformedImage = ({image , type , title,transformationConfig,isTransforming,setIsTransforming,hasDownload=false}:TransformedImageProps) => {
    const downloadHandler = () =>{

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
      {image?.publicId && transformationConfig ? (
        <div className="relative">
          <CldImage
            width={800}
            height={800}
            src={image?.publicId}
            alt="image"
            sizes={"(max-width : 767px) 100vw , 50vw"}
            placeholder={dataUrl as PlaceholderValue}
            className="media_uploader-cldImage"
            onLoad={()=>{
                setIsTransforming && setIsTransforming(false);
            }}
            onError={()=>{
                debounce(()=>{
                    setIsTransforming && setIsTransforming(false);
                },8000)
            }}
            {...transformationConfig}
          />
          {
            isTransforming && (
                <div className='transformming-loader'>
                    <Image src='/assets/iccons/spinner.svg' width={50} height={50} alt='transforming...'/>

                </div>
            )
          }
        </div>
      ) : (
        <div className="transformed-placeholder">TransformedImage</div>
      )}
    </div>
  );
}

export default TransformedImage