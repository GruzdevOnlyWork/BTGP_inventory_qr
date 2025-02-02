import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
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
    <div className="flex">
      <div className="flex-1 p-6">
        <Card className="w-full max-w-2xl mx-auto mt-6">
          <CardHeader>
            <CardTitle>{equipment.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Тип</p>
                <p>{equipment.type}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Местоположение</p>
                <p>{equipment.location}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Статус</p>
                <p>{equipment.status}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-gray-500">Описание</p>
                <p>{equipment.description}</p>
              </div>
              <div className="col-span-2 flex justify-center">
                <QRCodeSVG value={`https://${NameKey}/equipment/${id}`} size={128} />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
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
    </div>
  );
};

export default EquipmentDetails;
