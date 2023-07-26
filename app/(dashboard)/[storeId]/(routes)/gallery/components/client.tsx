"use client";

import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/ui/data-table";
import { ApiList } from "@/components/ui/api-list";
import { Gallery, GalleryImages, Image } from "@prisma/client";
import ImageUpload from "@/components/ui/image-upload";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import toast from "react-hot-toast";
import { useState } from "react";
import axios from "axios";

interface GalleryClientProps {
  data: Gallery | null;
  images: GalleryImages[] | undefined;
}

const formSchema = z.object({
  images: z.object({ url: z.string() }).array(),
});

type ImagesFormValues = z.infer<typeof formSchema>;

export const GalleryClient: React.FC<GalleryClientProps> = ({
  data,
  images,
}) => {
  const params = useParams();
  const router = useRouter();

  const toastMessage = images ? "Images updated." : "Image created.";
  const action = images ? "Save changes" : "Create";

  const [loading, setLoading] = useState(false);

  const form = useForm<ImagesFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: images
      ? {
          images,
        }
      : {
          images: [],
        },
  });

  const onSubmit = async (images: ImagesFormValues) => {
    try {
      setLoading(true);
      if (!data) {
        await axios.post(`/api/${params.storeId}/gallery`, images);
      } else {
        await axios.patch(`/api/${params.storeId}/gallery`, { images, data });
      }

      router.refresh();
      router.push(`/${params.storeId}/`);
      toast.success(toastMessage);
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Heading
        title={`Gallery Images `}
        description="Manage images for your store"
      />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="images"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Images</FormLabel>
                <FormControl>
                  <ImageUpload
                    value={field.value.map((image) => image.url)}
                    disabled={false}
                    onChange={(url) =>
                      field.onChange([...field.value, { url }])
                    }
                    onRemove={(url) =>
                      field.onChange([
                        ...field.value.filter((current) => current.url !== url),
                      ])
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div>
            <Button disabled={loading} className="ml-auto mt-10" type="submit">
              {action}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
};
