import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { insertExternalLinkSchema, ExternalLink } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

const formSchema = insertExternalLinkSchema.extend({
  platform: z.string().min(1, "Platform is required"),
  url: z.string().url("Please enter a valid URL"),
});

interface ExternalLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  externalLink?: ExternalLink;
}

const platformOptions = [
  "LinkedIn",
  "GitHub",
  "Portfolio Website",
  "Personal Website",
  "Twitter",
  "Instagram",
  "Facebook",
  "YouTube",
  "Behance",
  "Dribbble",
  "Stack Overflow",
  "Medium",
  "Dev.to",
  "Other"
];

export default function ExternalLinkModal({ isOpen, onClose, externalLink }: ExternalLinkModalProps) {
  const { toast } = useToast();
  const isEditing = !!externalLink;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      profileId: 1,
      platform: externalLink?.platform || "",
      url: externalLink?.url || "",
      displayText: externalLink?.displayText || "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: z.infer<typeof formSchema>) => {
      if (isEditing) {
        return apiRequest("PUT", `/api/external-links/${externalLink.id}`, data);
      } else {
        return apiRequest("POST", "/api/external-links", data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/profile/1/external-links"] });
      toast({
        title: "Success",
        description: `Link ${isEditing ? "updated" : "added"} successfully`,
      });
      onClose();
    },
    onError: () => {
      toast({
        title: "Error",
        description: `Failed to ${isEditing ? "update" : "add"} link`,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    mutation.mutate(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit External Link" : "Add External Link"}</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="platform"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Platform *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select platform" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {platformOptions.map((platform) => (
                        <SelectItem key={platform} value={platform}>
                          {platform}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL *</FormLabel>
                  <FormControl>
                    <Input {...field} type="url" placeholder="https://example.com" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="displayText"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Display Text</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Custom text to display (optional)" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
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
