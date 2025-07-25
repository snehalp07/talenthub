import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { insertEducationSchema, Education } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

const formSchema = insertEducationSchema.extend({
  institution: z.string().min(1, "Institution is required"),
  degree: z.string().min(1, "Degree is required"),
});

interface EducationModalProps {
  isOpen: boolean;
  onClose: () => void;
  education?: Education;
}

export default function EducationModal({ isOpen, onClose, education }: EducationModalProps) {
  const { toast } = useToast();
  const isEditing = !!education;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      profileId: 1,
      institution: education?.institution || "",
      degree: education?.degree || "",
      fieldOfStudy: education?.fieldOfStudy || "",
      startDate: education?.startDate || "",
      endDate: education?.endDate || "",
      isCurrentlyStudying: education?.isCurrentlyStudying || false,
      description: education?.description || "",
    },
  });

  const isCurrentlyStudying = form.watch("isCurrentlyStudying");

  const mutation = useMutation({
    mutationFn: async (data: z.infer<typeof formSchema>) => {
      if (isEditing) {
        return apiRequest("PUT", `/api/education/${education.id}`, data);
      } else {
        return apiRequest("POST", "/api/education", data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/profile/1/education"] });
      toast({
        title: "Success",
        description: `Education ${isEditing ? "updated" : "added"} successfully`,
      });
      onClose();
    },
    onError: () => {
      toast({
        title: "Error",
        description: `Failed to ${isEditing ? "update" : "add"} education`,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    mutation.mutate(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Education" : "Add Education"}</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="institution"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Institution *</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g., Harvard University" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="degree"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Degree *</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g., Bachelor of Science" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="fieldOfStudy"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Field of Study</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g., Computer Science" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Date</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g., September 2019" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Date</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        placeholder="e.g., May 2023" 
                        disabled={isCurrentlyStudying}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="isCurrentlyStudying"
                render={({ field }) => (
                  <FormItem className="md:col-span-2 flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>I am currently studying here</FormLabel>
                    </div>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea {...field} rows={3} placeholder="Describe your studies, achievements, etc." />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? "Saving..." : "Save"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
