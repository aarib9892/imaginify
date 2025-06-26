"use client";
import { useState, useTransition  , useEffect} from "react";
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
  publicId: z.string(),
});

import React from "react";
import {
  aspectRatioOptions,
  creditFee,
  defaultValues,
  transformationTypes,
} from "@/constants";
import { CustomField } from "./CustomField";
import { AspectRatioKey, debounce, deepMergeObjects } from "@/lib/utils";
import MediaUploader from "./MediaUploader";
import TransformedImage from "./TransformedImage";
import { updateCredits } from "@/lib/actions/user.actions";
import { getCldImageUrl } from "next-cloudinary";
import { addImage, updateImage } from "@/lib/actions/image.actions";
import { useRouter } from "next/navigation";
import { InsufficientCreditsModal } from "./InsufficientCreditsModal";

const TransformationForm = ({
  action,
  data = null,
  userId,
  type,
  creditBalance,
  config = null,
}: TransformationFormProps) => {
  const transformationType = transformationTypes[type];
  const [image, setImage] = useState(data);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTransforming, setIsTransforming] = useState(false);
  const [transformationConfig, setTransformationConfig] = useState(config);
  const [newTransformation, setNewTransformation] =
    useState<Transformations | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const initialValues =
    action === "Update"
      ? {
          title: data?.title,
          aspectRatio: data?.aspectRatio,
          color: data?.color,
          prompt: data?.prompt,
          publicId: data?.publicId,
        }
      : defaultValues;
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues,
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
    setIsSubmitting(true);
    if (data || image) {
      const transformationURL = getCldImageUrl({
        width: image?.width,
        height: image?.height,
        src: image?.publicId,
        ...transformationConfig,
      });

      const imageData = {
        title: values.title,
        publicId: image?.publicId,
        transformationType: type,
        width: image?.width,
        height: image?.height,
        config: transformationConfig,
        secureURL: image?.secureURL,
        transformationURL,
        aspectRatio: values.aspectRatio,
        prompt: values.prompt,
        color: values.color,
      };
      if (action === "Add") {
        try {
          const newImage = await addImage({
            image: imageData,
            path: "/",
            userId,
          });

          if (newImage) {
            form.reset();
            setImage(newImage);
            router.push(`/transformations/${newImage._id}`);
          }
        } catch (error) {
          console.log(error);
        }
      }
      if (action === "Update") {
        console.log( "UPDATED");
        try {
          const updatedImage = await updateImage({
            image: {
              ...imageData,
              _id: data._id,
            },
            path: "/",
            userId,
          });
          

          if (updatedImage) {
            router.push(`/transformations/${updatedImage._id}`);
          }
        } catch (error) {
          console.log(error);
        }
      }

      setIsSubmitting(false);
    }
  }

  const onSelectFieldHandler = (
    value: string,
    onChangeField: (value: string) => void
  ) => {
    const imageSize = aspectRatioOptions[value as AspectRatioKey];
    setImage((prev: any) => ({
      ...prev,
      width: imageSize.width,
      height: imageSize.height,
      aspectRatio: imageSize.aspectRatio,
    }));
    setNewTransformation(transformationType.config);
    console.log(imageSize,'SIZE')

    return onChangeField(value);
  };
  const onInputChangeHandler = (
    fieldName: string,
    value: string,
    type: string,
    onChangeField: (value: string) => void
  ) => {
    debounce(() => {
      setNewTransformation((prev: any) => ({
        ...prev,
        [type]: { ...prev?.[type] ,
          [fieldName === "prompt" ? "prompt" : "to"]: value
          
        }
       
      }));
    }, 1000)();

    return onChangeField(value);
  };
  //TODO: UPDATE credit fee
  const onTransformationHandler = async () => {
    setIsTransforming(true);
    console.log(newTransformation,'NEWTRAN')
    setTransformationConfig(
      deepMergeObjects(newTransformation, transformationConfig)
    );
    setNewTransformation(null);
    startTransition(async () => {
      await updateCredits(userId, creditFee);
    });
  };

  useEffect(() => {
    if(image && (type === 'restore' || type === 'removeBackground')){
      setNewTransformation(transformationType.config)

    }
    
  }, [image , transformationType.config , type]);
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {creditBalance < Math.abs(creditFee) && <InsufficientCreditsModal/>}
        <CustomField
          control={form.control}
          name="title"
          formLabel="Image Title"
          className="w-full"
          render={({ field }) => <Input {...field} className="input-field" />}
        />
        {type === "fill" && (
          <CustomField
            control={form.control}
            name="aspectRatio"
            formLabel="Aspect Ratio"
            className="w-full"
            render={({ field }) => (
              <Select
                onValueChange={(value) =>
                  onSelectFieldHandler(value, field.onChange)
                }
                value={field.value}
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
          <div className="prompt-field">
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
            className="flex size-full flex-col"
            render={({ field }) => (
              <MediaUploader
                onValueChange={field.onChange}
                setImage={setImage}
                publicId={field.value}
                type={type}
                image={image}
              />
            )}
          />

          <TransformedImage
            image={image}
            type={type}
            title={form.getValues().title}
            isTransforming={isTransforming}
            setIsTransforming={setIsTransforming}
            transformationConfig={transformationConfig}
          />
        </div>
        <div className="flex flex-col gap-4">
          <Button
            className="submit-button capitalize"
            disabled={isTransforming || newTransformation === null}
            type="button"
            onClick={onTransformationHandler}
          >
            {isTransforming ? "Transforming ..." : "Apply Transformation"}
          </Button>
          <Button
            className="submit-button capitalize"
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting ? "Submitting..." : "Save Image"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default TransformationForm;
