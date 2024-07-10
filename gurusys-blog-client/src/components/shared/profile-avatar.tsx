import { useProfileStore } from "../../lib/hooks";
import { Avatar, AvatarFallback, AvatarImage } from "../";

export function ProfileAvatar() {
  const { profile, getInitials } = useProfileStore();
  const initials = getInitials();

  return (
    <Avatar>
      <AvatarImage
        src={profile?.personal_info?.avatarUrl}
        alt="Profile Avatar"
      />
      <AvatarFallback>{initials}</AvatarFallback>
    </Avatar>
  );
}
