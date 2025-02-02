import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { QRCodeSVG } from "qrcode.react"; 
import { realtimeDb } from '@/firebase'; 
import { ref, onValue, remove } from 'firebase/database'; 
import EquipmentModal from '../components/EditEquipmentModal'; 

const EquipmentDetails = () => {
  const NameKey = import.meta.env.VITE_HOSTING_NAME;
  const { id } = useParams(); 
  const [equipment, setEquipment] = useState<any>(null);
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState<string | null>(null); 
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEquipmentDetails = () => {
      const equipmentRef = ref(realtimeDb, `/equipment/${id}`);
      onValue(equipmentRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setEquipment(data);
          setLoading(false);
        } else {
          setError("Оборудование не найдено.");
          setLoading(false);
        }
      }, (error) => {
        console.error("Ошибка при загрузке данных:", error);
        setError("Не удалось загрузить данные.");
        setLoading(false);
      });
    };

    fetchEquipmentDetails();
  }, [id]);

  const handleDelete = async () => {
    const equipmentRef = ref(realtimeDb, `equipment/${id}`);
    try {
      await remove(equipmentRef);
      console.log("Оборудование удалено");
      navigate('/home'); 
    } catch (error) {
      console.error("Ошибка при удалении оборудования:", error);
    }
  };

  if (loading) return <div>Загрузка...</div>; 
  if (error) return <div className="text-red-500">{error}</div>; 

  return (
    <div className="flex justify-center p-6">
      <Card className="w-full max-w-2xl mx-auto mt-6 shadow-lg">
        <CardHeader className="flex" >
          <CardTitle className="text-xl font-semibold">{equipment.name}</CardTitle>
          <p className="text-lg">{equipment.model || 'Не указана'}</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="col-span-2 p-4 border rounded-md bg-gray-50 " >
              <p className="text-sm font-medium text-gray-600">Тип</p>
              <p className="text-lg break-all">{equipment.type}</p>
            </div>
            <div className="col-span-2 p-4 border rounded-md bg-gray-50">
              <p className="text-sm font-medium text-gray-600">Местоположение</p>
              <p className="text-lg break-all">{equipment.location}</p>
            </div>
            <div className="col-span-2 p-4 border rounded-md bg-gray-50">
              <p className="text-sm font-medium text-gray-600">Статус</p>
              <p className="text-lg break-all">{equipment.status}</p>
            </div>
            <div className="col-span-2 p-4 border rounded-md bg-gray-50">
              <p className="text-sm font-medium text-gray-600">Серийный номер</p>
              <p className="text-lg break-all">{equipment.serialNumber || 'Не указан'}</p>
            </div>

            <div className="col-span-2 p-4 border rounded-md bg-gray-50">
              <p className="text-sm font-medium text-gray-600">Описание</p>
              <p className="break-all">{equipment.description || 'Нет описания'}</p> 
            </div>

            <div className="col-span-2 flex justify-center">
              <QRCodeSVG value={`https://${NameKey}/equipment/${id}`} size={128} />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-wrap justify-end gap-2"> 
          <Button variant="outline" onClick={() => window.print()}>QR</Button>
          <Button variant="outline" onClick={() => setIsEditModalOpen(true)}>Редактировать</Button>
          <Button variant="outline" className="bg-red-500 text-white hover:bg-red-600" onClick={handleDelete}>
            Удалить
          </Button>
        </CardFooter>
      </Card>

      {isEditModalOpen && (
        <EquipmentModal 
          isOpen={isEditModalOpen} 
          onClose={() => setIsEditModalOpen(false)} 
          equipment={equipment} 
        />
      )}
    </div>
  );
};

export default EquipmentDetails;
