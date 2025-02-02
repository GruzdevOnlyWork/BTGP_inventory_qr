import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { QRCodeSVG } from "qrcode.react";
import { Link } from "react-router-dom";

interface Equipment {
  id: string;
  name: string;
  type: string;
  location: string;
  status: string;
}

interface EquipmentCardProps {
  equipment: Equipment;
}

export const EquipmentCard = ({ equipment }: EquipmentCardProps) => {
  const NameKey = import.meta.env.VITE_HOSTING_NAME;
  const getStatusColor = (status: Equipment["status"]) => {
    switch (status) {
      case "В использовании":
        return "bg-green-100 text-green-800";
      case "В ремонте":
        return "bg-blue-100 text-blue-800";
      case "На поддержании":
        return "bg-yellow-100 text-yellow-800";
      case "Вышел из строя":
        return "bg-red-100 text-red-800";
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>{equipment.name}</span>
          <span className={`text-sm px-2 py-1 rounded-full ${getStatusColor(equipment.status)}`}>
            {equipment.status}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-500">Type</p>
          <p>{equipment.type}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Location</p>
          <p>{equipment.location}</p>
        </div>
        <div className="col-span-2 flex justify-center">
          <QRCodeSVG value={`https://${NameKey}/equipment/${equipment.id}`} size={128} />
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button variant="outline" onClick={() => window.print()}>Print QR</Button>
        <Link to={`/equipment/${equipment.id}`}>
              <Button  className="primary">View Details</Button>
        </Link>
      </CardFooter>
    </Card>
  );
};