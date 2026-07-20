import { PasswordStrengthIndicator } from "@/components/PasswordStrengthIndicator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  useDeleteUser,
  useLogout,
  useUpdateUser,
  type UserDataResponse,
} from "@/hooks/serverState/useUserServer";
import {
  AlertTriangle,
  Edit,
  Loader2,
  Mail,
  Save,
  Shield,
  Trash2,
  User,
} from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import PasswordInput from "./PasswordInput";
type FormData = {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  confirmPassword?: string;
  profilePicture?: string;
  image?: File;
};

const AdminAccountForm = ({ user }: { user: UserDataResponse }) => {
  const logout = useLogout();
  const { mutate: deleteUser } = useDeleteUser();
  const { mutate: updateUser } = useUpdateUser();
  const [formData, setFormData] = useState<FormData>({
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    password: "",
    confirmPassword: "",
    profilePicture: user?.profilePicture || "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    if (!user) return;
    if (user.status === "BLOCKED") {
      toast.error("Your account is blocked.");
      return;
    }

    // Validate form
    if (formData.password && formData.password.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setIsSaving(true);

    const updateData: Partial<FormData> = {};

    if (formData.firstName !== user.firstName) {
      updateData.firstName = formData.firstName;
    }
    if (formData.lastName !== user.lastName) {
      updateData.lastName = formData.lastName;
    }
    if (formData.email !== user.email) {
      updateData.email = formData.email;
    }

    if (formData.password) {
      updateData.password = formData.password;
    }

    if (formData.image) {
      updateData.image = formData.image;
    }

    if(Object.keys(updateData).length === 0){
      toast.error("Already up to date")
      return
    }

    updateUser(
      { id: user.id as string, user: updateData },
      {
        onSuccess: () => {
          setIsEditing(false);
          toast.success("Account updated successfully");
        },
      },
    );
  };

  const handleDeleteAccount = async () => {
    if (!user) return;
    if (user.status === "BLOCKED") {
      toast.error("Your account is blocked.");
      return;
    }
    setIsDeleting(true);
    deleteUser(user?.id as string, {
      onSuccess: () => {
        setIsDeleting(false);
        setIsDeleteDialogOpen(false);
        toast.success("Account deleted successfully");
        logout();
      },
    });
  };

  const getInitials = (firstName?: string, lastName?: string) => {
    if (!firstName && !lastName) return "U";
    return `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase();
  };

  return (
    <div className="min-h-screen bg-muted/30 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="flex flex-col gap-6">
          {/* Page Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold">Account Management</h1>
              <p className="text-muted-foreground mt-1">
                Manage your personal information and preferences
              </p>
            </div>
            <div className="flex items-center gap-3">
              {user?.role === "ADMIN" && (
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                  <Shield className="h-4 w-4" />
                  Admin Account
                </div>
              )}
            </div>
          </div>

          {/* Profile Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profile Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-6">
                {/* Avatar */}
                <div className="flex flex-col items-center gap-3">
                  <Avatar className="h-24 w-24">
                    <AvatarImage
                      src={formData.profilePicture}
                      alt={`${formData.firstName} ${formData.lastName}`}
                    />
                    <AvatarFallback className="text-xl">
                      {getInitials(user.firstName, user.lastName)}
                    </AvatarFallback>
                  </Avatar>
                  {isEditing && (
                    <div className="w-full">
                      <Label htmlFor="profilePicture" className="sr-only">
                        Profile Picture
                      </Label>
                      <Input
                        id="profilePicture"
                        name="profilePicture"
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const imageUrl = URL.createObjectURL(file);
                            setFormData((prev) => ({
                              ...prev,
                              profilePicture: imageUrl,
                              image: file,
                            }));
                          }
                        }}
                        disabled={isSaving}
                        className="text-sm"
                      />
                    </div>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(!isEditing)}
                    disabled={isSaving}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    {isEditing ? "Cancel" : "Edit Profile"}
                  </Button>
                </div>

                {/* Profile Form */}
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      disabled={!isEditing || isSaving}
                      placeholder="Enter your first name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      disabled={!isEditing || isSaving}
                      placeholder="Enter your last name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled={!isEditing || isSaving}
                      placeholder="Enter your email"
                    />
                  </div>

                  {isEditing && (
                    <>
                      <div>
                        <PasswordInput
                          id="password"
                          label="New Password"
                          value={formData.password}
                          onChange={handleInputChange}
                          name="password"
                          required
                          disabled={isSaving}
                          placeholder="Enter new password"
                        />

                        {formData.password && (
                          <PasswordStrengthIndicator
                            password={formData.password}
                          />
                        )}
                      </div>
                      <PasswordInput
                        required
                        label="Confirm New Password"
                        id="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        name="confirmPassword"
                        disabled={isSaving}
                        placeholder="Confirm new password"
                      />
                    </>
                  )}
                </div>
              </div>

              {isEditing && (
                <div className="mt-6 flex justify-end">
                  <Button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex items-center gap-2"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Account Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Account Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Account Role</Label>
                  <div className="px-3 py-2 bg-muted rounded-md">
                    {user?.role === "ADMIN"
                      ? "Administrator"
                      : user?.role === "CONTRIBUTOR"
                        ? "Contributor"
                        : "Regular User"}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Account Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Account Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <div
                  className={`w-3 h-3 rounded-full ${
                    user?.status === "ACTIVE" ? "bg-green-500" : "bg-destructive"
                  }`}
                />
                <div>
                  <p className="font-medium">
                    {user?.status === "ACTIVE" ? "Active" : "Blocked"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {user?.status === "ACTIVE"
                      ? "Your account is active and in good standing"
                      : "Your account has been blocked. Please contact support."}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                <AlertTriangle className="h-5 w-5" />
                Danger Zone
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="font-medium mb-1">Delete Account</p>
                  <p className="text-sm text-muted-foreground">
                    Once you delete your account, there is no going back. This
                    action will permanently delete your account and remove all
                    associated data from our servers.
                  </p>
                </div>
                <Dialog
                  open={isDeleteDialogOpen}
                  onOpenChange={setIsDeleteDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button
                      variant="destructive"
                      className="flex items-center gap-2"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete Account
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2 text-destructive">
                        <AlertTriangle className="h-5 w-5" />
                        Are you absolutely sure?
                      </DialogTitle>
                      <DialogDescription>
                        This action cannot be undone. This will permanently
                        delete your account and all associated data.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="flex flex-col sm:flex-row gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setIsDeleteDialogOpen(false)}
                        disabled={isDeleting}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={handleDeleteAccount}
                        disabled={isDeleting}
                        className="flex items-center gap-2"
                      >
                        {isDeleting ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Deleting...
                          </>
                        ) : (
                          <>
                            <Trash2 className="h-4 w-4" />
                            Delete Account
                          </>
                        )}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminAccountForm;
