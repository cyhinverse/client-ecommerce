"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";

export default function SettingsPage() {
  return (
    <div className="space-y-6 no-scrollbar">
      <div>
        <h3 className="text-lg font-medium">Settings</h3>
        <p className="text-sm text-muted-foreground">
          Manage system settings and display preferences.
        </p>
      </div>
      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="w-full justify-start overflow-x-auto no-scrollbar">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="display">Display</TabsTrigger>
        </TabsList>
        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Store Information</CardTitle>
              <CardDescription>
                Update basic store information.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="name">Store Name</Label>
                <Input id="name" defaultValue="My E-commerce Store" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="email">Contact Email</Label>
                <Input id="email" defaultValue="contact@example.com" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" defaultValue="+84 123 456 789" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Configuration</CardTitle>
              <CardDescription>
                Choose events to receive notifications for.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="new-orders" className="flex flex-col space-y-1">
                  <span>New Orders</span>
                  <span className="font-normal text-xs text-muted-foreground">
                    Receive notifications when new orders are placed.
                  </span>
                </Label>
                <Switch id="new-orders" defaultChecked />
              </div>
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="low-stock" className="flex flex-col space-y-1">
                  <span>Low Stock</span>
                  <span className="font-normal text-xs text-muted-foreground">
                    Alert when products are running low on stock.
                  </span>
                </Label>
                <Switch id="low-stock" defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="display" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Interface</CardTitle>
              <CardDescription>
                Customize admin interface.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="dark-mode" className="flex flex-col space-y-1">
                  <span>Dark Mode</span>
                  <span className="font-normal text-xs text-muted-foreground">
                    Switch between light and dark themes.
                  </span>
                </Label>
                <Switch id="dark-mode" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
