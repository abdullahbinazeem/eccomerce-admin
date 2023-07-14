"use client";

import * as z from "zod";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { Shipping } from "@prisma/client";
import { Trash } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { AlertModal } from "@/components/modals/alert-modal";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const formSchema = z.object({
  isFixed: z.enum(["fixed", "rate"]),
  name: z.string().min(1),
  price: z.coerce.number(),
  width: z.coerce.number(),
  height: z.coerce.number(),
  length: z.coerce.number(),
  weight: z.coerce.number(),
});

type ShippingFormValues = z.infer<typeof formSchema>;

interface ShippingFormProps {
  initialData: Shipping | null;
}

export const ShippingForm: React.FC<ShippingFormProps> = ({ initialData }) => {
  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = initialData ? "Edit shipping" : "Create shipping";
  const description = initialData ? "Edit a shipping" : "Add a new shipping";
  const toastMessage = initialData ? "Shipping updated." : "Shipping created.";
  const action = initialData ? "Save changes" : "Create";

  const form = useForm<ShippingFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? {
          ...initialData,
          price: initialData.isFixed
            ? parseFloat(String(initialData?.price))
            : 0,
          width: initialData.isFixed
            ? 0
            : parseFloat(String(initialData?.width)),
          height: initialData.isFixed
            ? 0
            : parseFloat(String(initialData?.height)),
          length: initialData.isFixed
            ? 0
            : parseFloat(String(initialData?.length)),
          weight: initialData.isFixed
            ? 0
            : parseFloat(String(initialData?.weight)),
          isFixed: initialData.isFixed ? "fixed" : "rate",
        }
      : {
          isFixed: "fixed",
          name: "",
          price: 0,
          width: 0,
          height: 0,
          length: 0,
          weight: 0,
        },
  });

  const isFixed = form.watch("isFixed");

  const onSubmit = async (data: ShippingFormValues) => {
    try {
      setLoading(true);
      if (initialData) {
        await axios.patch(
          `/api/${params.storeId}/shippings/${params.shippingId}`,
          data
        );
      } else {
        await axios.post(`/api/${params.storeId}/shippings`, data);
      }
      router.refresh();
      router.push(`/${params.storeId}/shippings`);
      toast.success(toastMessage);
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(
        `/api/${params.storeId}/shippings/${params.shippingId}`
      );

      router.refresh();
      router.push(`/${params.storeId}/shippings`);
      toast.success("Shipping deleted");
    } catch (error) {
      toast.error(
        "Make sure you removed all products using this shipping first."
      );
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      />
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {initialData && (
          <Button
            variant="destructive"
            size="sm"
            disabled={loading}
            onClick={() => {
              setOpen(true);
            }}
          >
            <Trash className="h-4 w-4 " />
          </Button>
        )}
      </div>
      <Separator />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="isFixed"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>How do you want to calculate shipping</FormLabel>
                  <FormControl>
                    <RadioGroup
                      // @ts-ignore
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="fixed" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Fixed Rates
                        </FormLabel>
                      </FormItem>

                      {/* <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="rate" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Rates at Checkout
                        </FormLabel>
                        
                      </FormItem> */}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Shipping name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {isFixed != "fixed" ? (
              <FormField
                control={form.control}
                name="weight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Weight (Kg.)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        disabled={loading}
                        placeholder="Shipping weight"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ) : (
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        disabled={loading}
                        placeholder="Shipping Fixed Price"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>
          {isFixed == "fixed" ? (
            <div></div>
          ) : (
            <div className="grid grid-cols-4 gap-8">
              <FormField
                control={form.control}
                name="length"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Length (in.)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        disabled={loading}
                        placeholder="0"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="width"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Width (in.)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        disabled={loading}
                        placeholder="0"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="height"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Height (in.)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        disabled={loading}
                        placeholder="0"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}
          <Button disabled={loading} className="ml-auto" type="submit">
            {action}
          </Button>
        </form>
      </Form>
      <Separator />
    </>
  );
};
