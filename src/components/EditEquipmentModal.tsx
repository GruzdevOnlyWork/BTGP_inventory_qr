import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useParams} from 'react-router-dom';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { realtimeDb } from '@/firebase'; 
import { ref, set } from 'firebase/database'; 
import { onValue } from 'firebase/database'; 

interface Equipment {
  id: string;
  name: string;
  type: string;
  location: string;
  status: string;
  description: string;
}

interface EditEquipmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  equipment: Equipment; // Убедитесь, что этот объект передается правильно
}

const EditEquipmentModal = ({ isOpen, onClose, equipment }: EditEquipmentModalProps) => {
  const [equipmentTypes, setEquipmentTypes] = useState([]);
  const [equipmentStatuses, setEquipmentStatuses] = useState([]);
  const { id } = useParams(); 
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  // Функция для получения типов оборудования
  const fetchEquipmentTypes = () => {
    const typesRef = ref(realtimeDb, 'equipmentTypes');
    onValue(typesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const typesData = Object.keys(data).map(key => ({
          id: key,
          ...data[key],
        }));
        setEquipmentTypes(typesData);
      }
    });
  };

  // Функция для получения статусов оборудования
  const fetchEquipmentStatuses = () => {
    const statusesRef = ref(realtimeDb, 'equipmentStatuses');
    onValue(statusesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const statusesData = Object.keys(data).map(key => ({
          id: key,
          ...data[key],
        }));
        setEquipmentStatuses(statusesData);
      }
    });
  };

  // Эффект для загрузки данных при открытии модального окна
  useEffect(() => {
    if (isOpen) {
      fetchEquipmentTypes();
      fetchEquipmentStatuses();
      
      // Инициализация состояния с данными оборудования
      if (equipment) {
        setName(equipment.name);
        setLocation(equipment.location);
        setDescription(equipment.description);
        setSelectedType(equipment.type);
        setSelectedStatus(equipment.status);
      }
    }
    
  }, [isOpen, equipment]);

  // Обработчик сохранения изменений
  const handleSaveChanges = async (event) => {
    event.preventDefault();
    console.log("Сохранение изменений для оборудования с ID:", id); // Проверка ID
  
    if (equipment && id) {
      try {
        const equipmentRef = ref(realtimeDb, `equipment/${id}`);
        await set(equipmentRef, {
          name,
          type: selectedType,
          location,
          status: selectedStatus,
          description,
        });
        console.log("Изменения успешно сохранены.");
        onClose(); // Закрытие модального окна
      } catch (error) {
        console.error("Ошибка при сохранении изменений:", error);
        alert("Не удалось сохранить изменения. Пожалуйста, попробуйте еще раз.");
      }
    } else {
      console.error("ID оборудования отсутствует."); // Отладочная информация
      console.log("Сохранение das:", id); // Проверка ID
    }
  };

  if (!isOpen) return null; 

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Редактировать оборудование</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-6" onSubmit={handleSaveChanges}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Название оборудования</Label>
                <Input 
                  id="name" 
                  placeholder="Введите название оборудования" 
                  value={name}
                  onChange={(e) => setName(e.target.value)} 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Тип</Label>
                <Select onValueChange={setSelectedType} value={selectedType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите тип" />
                  </SelectTrigger>
                  <SelectContent>
                    {equipmentTypes.map(type => (
                      <SelectItem key={type.id} value={type.name}>{type.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Местоположение</Label>
                <Input 
                  id="location" 
                  placeholder="Введите местоположение" 
                  value={location}
                  onChange={(e) => setLocation(e.target.value)} 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Статус</Label>
                <Select onValueChange={setSelectedStatus} value={selectedStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите статус" />
                  </SelectTrigger>
                  <SelectContent>
                    {equipmentStatuses.map(status => (
                      <SelectItem key={status.id} value={status.name}>{status.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="description">Описание</Label>
                <Input 
                  id="description" 
                  placeholder="Введите описание оборудования" 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)} 
                />
              </div>

            </div>

            <Button type="submit" className="w-full">Сохранить изменения</Button>
          </form>
          <Button onClick={onClose} className="mt-4">Закрыть</Button> 
        </CardContent>
      </Card>
    </div>
  );
};

export default EditEquipmentModal;
