import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  User as UserIcon,
  Mail,
  Calendar,
  MapPin,
  CheckCircle,
  XCircle,
  Edit,
  Shield,
} from "lucide-react";
import { User } from "@/types/user";
import Image from "next/image";

interface ViewModelUserProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User | null;
  onEdit?: (user: User) => void;
}

export function ViewModelUser({
  open,
  onOpenChange,
  user,
  onEdit,
}: ViewModelUserProps) {
  if (!user) return null;

  const getVerifiedBadge = (isVerified: boolean) => {
    return isVerified ? (
      <Badge className="bg-green-100 text-green-700 hover:bg-green-100 dark:bg-green-500/10 dark:text-green-400 border-0 rounded-lg px-2.5 py-0.5 shadow-none flex items-center gap-1 w-fit">
        <CheckCircle className="h-3 w-3" />
        Verified
      </Badge>
    ) : (
      <Badge variant="outline" className="bg-gray-100 text-gray-600 border-0 rounded-lg px-2.5 py-0.5 shadow-none flex items-center gap-1 w-fit">
        <XCircle className="h-3 w-3" />
        Unverified
      </Badge>
    );
  };
  
  const getRoleBadge = (roles: string) => {
      const colors: { [key: string]: string } = {
          admin: "bg-purple-100 text-purple-700 hover:bg-purple-100 border-0",
          user: "bg-blue-50 text-blue-700 hover:bg-blue-50 border-0",
      };
      
      return (
          <Badge className={`${colors[roles] || "bg-gray-100"} rounded-lg px-2.5 py-0.5 shadow-none border-0`}>
              {roles.charAt(0).toUpperCase() + roles.slice(1)}
          </Badge>
      );
  };

  const handleEdit = () => {
    if (onEdit && user) {
      onOpenChange(false);
      onEdit(user);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-[2rem] border-border/50 bg-white/80 dark:bg-[#1C1C1E]/80 backdrop-blur-xl shadow-2xl p-6 max-w-lg max-h-[90vh] overflow-y-auto no-scrollbar">
        <DialogHeader className="border-b border-border/50 pb-6 mb-6">
            <div className="flex items-center justify-between">
                <div>
                     <DialogTitle className="text-2xl font-bold tracking-tight">User Profile</DialogTitle>
                     <DialogDescription className="text-muted-foreground mt-1">
                        Detailed information about {user.username}
                    </DialogDescription>
                </div>
                {user.roles && getRoleBadge(user.roles)}
            </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* User Info Card */}
          <div className="rounded-2xl bg-gradient-to-br from-gray-50/80 to-gray-100/50 border border-border/50 p-6 flex flex-col items-center text-center">
             <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-sm mb-4">
                  {user.avatar ? (
                    <Image
                      src={user.avatar}
                      alt={user.username}
                      fill
                      className="object-cover"
                      sizes="96px"
                    />
                  ) : (
                     <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <UserIcon className="h-10 w-10 text-muted-foreground" />
                     </div>
                  )}
             </div>
             <h3 className="text-xl font-bold text-foreground mb-1">
                 {user.username}
             </h3>
             <div className="flex items-center gap-1.5 text-muted-foreground text-sm mb-4">
                 <Mail className="h-3 w-3" />
                 {user.email}
             </div>
             {getVerifiedBadge(user.isVerifiedEmail)}
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-4">
               <div className="p-4 rounded-xl bg-gray-50/50 border border-border/50">
                    <div className="flex items-center gap-2 mb-2 text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span className="text-xs font-medium uppercase tracking-wider">Joined Date</span>
                    </div>
                    <p className="font-medium text-sm">{formatDate(user.createdAt)}</p>
               </div>
               <div className="p-4 rounded-xl bg-gray-50/50 border border-border/50">
                    <div className="flex items-center gap-2 mb-2 text-muted-foreground">
                        <Shield className="h-4 w-4" />
                        <span className="text-xs font-medium uppercase tracking-wider">Account Role</span>
                    </div>
                    <p className="font-medium text-sm capitalize">{user.roles || "User"}</p>
               </div>
          </div>

          {/* Contact & Address */}
          <div>
            <h4 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-muted-foreground mb-3">
                 <MapPin className="h-4 w-4" />
                 Addresses
            </h4>
            
            <div className="space-y-3">
              {user.addresses && user.addresses.length > 0 ? (
                 user.addresses.map((addr, index) => (
                    <div key={index} className="p-4 rounded-xl bg-white/50 border border-border/50 hover:bg-gray-50/50 transition-colors">
                        <div className="flex justify-between items-start mb-1">
                             <span className="font-bold text-sm text-foreground">{addr.fullName}</span>
                             <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md">{addr.phone}</span>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            {addr.address}, {addr.ward}, {addr.district}, {addr.city}
                        </p>
                    </div>
                 ))
              ) : (
                <div className="p-6 rounded-xl border border-dashed border-border/50 text-center bg-gray-50/30">
                     <p className="text-sm text-muted-foreground">No addresses registered for this user.</p>
                </div>
              )}
            </div>
          </div>
        </div>
        
         {/* Footer Actions */}
         <div className="flex justify-end gap-3 pt-6 border-t border-border/50 mt-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="rounded-xl h-10 border-gray-200 px-5"
            >
              Close
            </Button>
            {onEdit && (
              <Button
                onClick={handleEdit}
                className="rounded-xl h-10 bg-black text-white hover:bg-black/90 dark:bg-[#0071e3] gap-2 px-5"
              >
                <Edit className="h-4 w-4" />
                Edit User
              </Button>
            )}
        </div>
      </DialogContent>
    </Dialog>
  );
}