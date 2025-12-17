"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
  return (
    <div className="space-y-8 p-1">
      <div>
        <h2 className="text-xl font-semibold tracking-tight text-foreground">Settings</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Manage system settings and display preferences
        </p>
      </div>
      
      <Tabs defaultValue="general" className="space-y-6">
        <div className="rounded-[1.5rem] border border-border/40 bg-white/70 dark:bg-[#1C1C1E]/70 p-2 shadow-sm backdrop-blur-xl w-fit">
          <TabsList className="bg-transparent p-0 gap-2">
            <TabsTrigger 
              value="general" 
              className="rounded-xl px-4 py-2 hover:bg-black/5 dark:hover:bg-white/10 data-[state=active]:bg-white dark:data-[state=active]:bg-[#2C2C2E] data-[state=active]:shadow-sm transition-all text-sm font-medium"
            >
              General
            </TabsTrigger>
            <TabsTrigger 
              value="notifications" 
              className="rounded-xl px-4 py-2 hover:bg-black/5 dark:hover:bg-white/10 data-[state=active]:bg-white dark:data-[state=active]:bg-[#2C2C2E] data-[state=active]:shadow-sm transition-all text-sm font-medium"
            >
              Notifications
            </TabsTrigger>
            <TabsTrigger 
              value="display" 
              className="rounded-xl px-4 py-2 hover:bg-black/5 dark:hover:bg-white/10 data-[state=active]:bg-white dark:data-[state=active]:bg-[#2C2C2E] data-[state=active]:shadow-sm transition-all text-sm font-medium"
            >
              Display
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="general" className="mt-0">
          <div className="rounded-[2rem] border border-border/40 bg-white/70 dark:bg-[#1C1C1E]/70 p-6 shadow-sm backdrop-blur-xl space-y-8">
            <div>
              <h3 className="text-lg font-semibold tracking-tight">Store Information</h3>
              <p className="text-sm text-muted-foreground mt-1">Update basic store details and contact info</p>
            </div>
            
            <div className="grid gap-6 max-w-xl">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">Store Name</Label>
                <Input 
                  id="name" 
                  defaultValue="My E-commerce Store" 
                  className="rounded-xl bg-gray-50/50 border-gray-200 focus:bg-white transition-all h-10"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">Contact Email</Label>
                <Input 
                  id="email" 
                  defaultValue="contact@example.com" 
                  className="rounded-xl bg-gray-50/50 border-gray-200 focus:bg-white transition-all h-10"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-medium">Phone Number</Label>
                <Input 
                  id="phone" 
                  defaultValue="+84 123 456 789" 
                  className="rounded-xl bg-gray-50/50 border-gray-200 focus:bg-white transition-all h-10"
                />
              </div>
              
              <div className="pt-2">
                <Button className="rounded-xl bg-black hover:bg-black/90 text-white dark:bg-[#0071e3] dark:hover:bg-[#0077ED] h-10 px-6">
                  Save Changes
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="notifications" className="mt-0">
          <div className="rounded-[2rem] border border-border/40 bg-white/70 dark:bg-[#1C1C1E]/70 p-6 shadow-sm backdrop-blur-xl space-y-8">
            <div>
              <h3 className="text-lg font-semibold tracking-tight">Notification Configuration</h3>
              <p className="text-sm text-muted-foreground mt-1">Choose which events trigger notifications</p>
            </div>
            
            <div className="space-y-6 max-w-2xl">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-gray-50/50 dark:bg-white/5 border border-border/40">
                <div className="flex flex-col space-y-1">
                  <Label htmlFor="new-orders" className="text-base font-medium">New Orders</Label>
                  <span className="text-xs text-muted-foreground font-normal">
                    Check to receive notifications when new orders are placed
                  </span>
                </div>
                <Switch id="new-orders" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between p-4 rounded-2xl bg-gray-50/50 dark:bg-white/5 border border-border/40">
                <div className="flex flex-col space-y-1">
                  <Label htmlFor="low-stock" className="text-base font-medium">Low Stock Alerts</Label>
                  <span className="text-xs text-muted-foreground font-normal">
                    Get notified when product inventory drops below threshold
                  </span>
                </div>
                <Switch id="low-stock" defaultChecked />
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="display" className="mt-0">
          <div className="rounded-[2rem] border border-border/40 bg-white/70 dark:bg-[#1C1C1E]/70 p-6 shadow-sm backdrop-blur-xl space-y-8">
            <div>
              <h3 className="text-lg font-semibold tracking-tight">Interface Configuration</h3>
              <p className="text-sm text-muted-foreground mt-1">Customize the look and feel of your admin panel</p>
            </div>
            
            <div className="space-y-6 max-w-2xl">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-gray-50/50 dark:bg-white/5 border border-border/40">
                <div className="flex flex-col space-y-1">
                  <Label htmlFor="dark-mode" className="text-base font-medium">Dark Mode Preferences</Label>
                  <span className="text-xs text-muted-foreground font-normal">
                    Toggle between light and dark themes for the interface
                  </span>
                </div>
                <Switch id="dark-mode" />
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
