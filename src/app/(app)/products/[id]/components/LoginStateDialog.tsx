import Link from "next/link";
import { Button } from "../../../../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../../../components/ui/dialog";

export const LoginStateDialog = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  return (
    <Dialog open={isOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>You are not logged in</DialogTitle>
          <DialogDescription>If you want to purchase this product, please login</DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <div className="flex justify-between w-full">
            <Link href="/welcome">
              <Button variant="outline" type="button">
                Go to login page
              </Button>
            </Link>
            <Button onClick={onClose} type="button">
              Cancel
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
