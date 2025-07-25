import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { insertCertificationSchema, Certification } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

const formSchema = insertCertificationSchema.extend({
  name: z.string().min(1, "Certification name is required"),
  issuer: z.string().min(1, "Issuer is required"),
});

interface CertificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  certification?: Certification;
}

export default function CertificationModal({ isOpen, onClose, certification }: CertificationModalProps) {
  const { toast } = useToast();
  const isEditing = !!certification;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      profileId: 1,
      name: certification?.name || "",
      issuer: certification?.issuer || "",
      issueDate: certification?.issueDate || "",
      expiryDate: certification?.expiryDate || "",
      credentialId: certification?.credentialId || "",
      credentialUrl: certification?.credentialUrl || "",
      isBlockchainVerified: certification?.isBlockchainVerified || false,
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: z.infer<typeof formSchema>) => {
      if (isEditing) {
        return apiRequest("PUT", `/api/certifications/${certification.id}`, data);
      } else {
        return apiRequest("POST", "/api/certifications", data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/profile/1/certifications"] });
      toast({
        title: "Success",
        description: `Certification ${isEditing ? "updated" : "added"} successfully`,
      });
      onClose();
    },
    onError: () => {
      toast({
        title: "Error",
        description: `Failed to ${isEditing ? "update" : "add"} certification`,
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
          <DialogTitle>{isEditing ? "Edit Certification" : "Add Certification"}</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Certification Name *</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g., AWS Certified Solutions Architect" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="issuer"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Issuing Organization *</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g., Amazon Web Services" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="issueDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Issue Date</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g., January 2023" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="expiryDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Expiry Date</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g., January 2026 (leave empty if no expiry)" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="credentialId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Credential ID</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g., ABC123DEF456" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="credentialUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Credential URL</FormLabel>
                    <FormControl>
                      <Input {...field} type="url" placeholder="e.g., https://www.credly.com/badges/..." />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="isBlockchainVerified"
                render={({ field }) => (
                  <FormItem className="md:col-span-2 flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Blockchain Verified</FormLabel>
                      <p className="text-sm text-gray-600">
                        Check this if your certification is verified on a blockchain platform
                      </p>
                    </div>
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
