
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Bell, X } from "lucide-react";
import { useState } from "react";

interface NewFeatureBannerProps {
  title: string;
  description: string;
  ctaLabel?: string;
  ctaAction?: () => void;
}

const NewFeatureBanner: React.FC<NewFeatureBannerProps> = ({
  title,
  description,
  ctaLabel = "Lihat Sekarang",
  ctaAction,
}) => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) {
    return null;
  }

  return (
    <Card className="bg-finance-primary/10 border-finance-primary/30">
      <CardContent className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-finance-primary flex items-center justify-center text-white">
            <Bell size={16} />
          </div>
          <div>
            <h4 className="font-medium text-finance-primary">{title}</h4>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {ctaAction && (
            <Button
              variant="outline"
              size="sm"
              className="border-finance-primary text-finance-primary hover:bg-finance-primary hover:text-white"
              onClick={ctaAction}
            >
              {ctaLabel}
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground"
            onClick={() => setIsVisible(false)}
          >
            <X size={16} />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default NewFeatureBanner;
