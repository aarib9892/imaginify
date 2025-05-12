"use client";
import {useState, useTransition} from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Form,
  // FormControl,
  // FormDescription,
  // FormField,
  // FormItem,
  // FormLabel,
  // FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
 
export const formSchema = z.object({
  title: z.string(),
  aspectRatio: z.string().optional(),
  color: z.string().optional(),
  prompt: z.string().optional(),
  publicId: z.string()
});

import React from "react";
import { aspectRatioOptions, defaultValues, transformationTypes } from "@/constants";
import { CustomField } from "./CustomField";
import { AspectRatioKey, debounce, deepMergeObjects } from "@/lib/utils";
import MediaUploader from "./MediaUploader";

const TransformationForm = ({action , data=null , userId , type , creditBalance ,config=null}:TransformationFormProps) => {
  const transformationType = transformationTypes[type]
  const [image, setImage] = useState();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTransforming, setIsTransforming] = useState(false);
  const [transformationconfig, setTransformationConfig] = useState(config);
  const [newTransformation, setNewTransformation] = useState<Transformations | null>(null);
  const [isPending , startTransition] = useTransition()
    const initialValues =
      action === "Update"
        ? {
            title:data?.title,
            aspectRatio: data?.aspectRatio,
            color: data?.color,
            prompt: data?.prompt,
            publicId: data?.publicId
          }
        : defaultValues;
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues,
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }

  const onSelectFieldHandler = (value:string , onChangeField:(value:string)=> void) =>{
    const imageSize=  aspectRatioOptions[value as AspectRatioKey]
    setImage((prev:any) => ({...prev,
      width:imageSize.width,
      height:imageSize.height,
      aspectRatio:imageSize.aspectRatio
    }))
    setNewTransformation(transformationType.config)
 
 return onChangeField(value) 
}
  const onInputChangeHandler = (fieldName:string, value:string,type:string, onChangeField:(value:string)=> void) => {
    debounce(() => {
      setNewTransformation((prev:any) => ({
        ...prev,
        [type]:{...prev.type},
        [fieldName === 'prompt' ? 'prompt' : 'to']: value,
      }))

    }, 1000);

    return onChangeField(value)
  }
  //TODO:Return to config credits
  const onTransformationHandler = async () => {
    setIsTransforming(true)
    setTransformationConfig(
      deepMergeObjects(newTransformation,transformationconfig)

    )
    setNewTransformation(null)
    startTransition(() => {})
  }
   return (
     <Form {...form}>
       <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
         <CustomField
           control={form.control}
           name="title"
           formLabel="Image Title"
           className="w-full"
           render={(field) => <Input {...field} className="input-field" />}
         />
         {type === "fill" && (
           <CustomField
             control={form.control}
             name="aspectRatio"
             formLabel="Aspect Ratio"
             className="w-full"
             render={({field}) => (
               <Select
                 onValueChange={(value) =>
                   onSelectFieldHandler(value, field.onChange)
                 }
                 defaultValue={field.value}
               >
                 <SelectTrigger className="select-field">
                   <SelectValue placeholder="Select Size" />
                 </SelectTrigger>
                 <SelectContent>
                   {Object.keys(aspectRatioOptions).map((key) => (
                     <SelectItem className="select-item" key={key} value={key}>
                       {aspectRatioOptions[key as AspectRatioKey].label}
                     </SelectItem>
                   ))}
                 </SelectContent>
               </Select>
             )}
           />
         )}

         {(type === "recolor" || type === "remove") && (
           <div className="prompy-field">
             <CustomField
               control={form.control}
               formLabel={
                 type === "recolor" ? "Object to recolor" : "Object to remove"
               }
               name="prompt"
               className="w-full"
               render={({ field }) => (
                 <Input
                   value={field.value}
                   className="input-field"
                   onChange={(e) => {
                     onInputChangeHandler(
                       "prompt",
                       e.target.value,
                       type,
                       field.onChange
                     );
                   }}
                 />
               )}
             />

             {type === "recolor" && (
               <CustomField
                 control={form.control}
                 name="color"
                 formLabel="Replacement Color"
                 className="w-full"
                 render={({ field }) => (
                   <Input
                     value={field.value}
                     className="input-field"
                     onChange={(e) => {
                       onInputChangeHandler(
                         "color",
                         e.target.value,
                         "recolor",
                         field.onChange
                       );
                     }}
                   />
                 )}
               />
             )}
           </div>
         )}

         <div className="media-uploader-field">
         <CustomField
         control={form.control}
         name="publicId"
         className="flrx size-full flex-col"
         render={({field}) => (
          <MediaUploader 
          onValueChange={field.onChange}
          setImage={setImage}
          publicId={field.value}
          type={type}
          />

         )}
         />

         </div>
         <div className="flex flex-col gap-4">
           <Button
             className="submit-button capitalize"
             disabled={isTransforming || newTransformation === null}
             type="button"
             onClick={onTransformationHandler}
           >
             {
              isTransforming ? (
                'Transforming ...'
              ):('Apply Transformation')
             }
           </Button>
         <Button
           className="submit-button capitalize"
           disabled={isSubmitting}
           type="submit"
         >
           {isSubmitting ? "Submitting..." : 'Save Image'}
         </Button>
         </div>

       </form>
     </Form>
   );
};

export default TransformationForm;
