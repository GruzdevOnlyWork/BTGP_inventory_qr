import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { realtimeDb } from '@/firebase'; 
import { ref, onValue, set } from 'firebase/database'; 
import { QRCodeSVG } from 'qrcode.react';

interface Equipment {
  id?: string; 
  name: string;
  type: string;
  location: string;
  status: string;
  description: string;
}

interface EquipmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  equipment?: Equipment; 
}

const EquipmentModal = ({ isOpen, onClose, equipment }: EquipmentModalProps) => {
  const [equipmentTypes, setEquipmentTypes] = useState([]);
  const [equipmentStatuses, setEquipmentStatuses] = useState([]);
  
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

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

  useEffect(() => {
    if (isOpen) {
      fetchEquipmentTypes();
      fetchEquipmentStatuses();

      if (equipment) {
        setName(equipment.name);
        setLocation(equipment.location);
        setDescription(equipment.description);
        setSelectedType(equipment.type);
        setSelectedStatus(equipment.status);
      }
    }
  }, [isOpen, equipment]);
  const handleSaveChanges = async (event) => {
    event.preventDefault();

    if (equipment) {
      const equipmentRef = ref(realtimeDb, `equipment/${equipment.id}`);
      await set(equipmentRef, {
        name,
        type: selectedType,
        location,
        status: selectedStatus,
        description,
      });
    } else {
      const newEquipmentRef = ref(realtimeDb, 'equipment/' + Date.now());
      await set(newEquipmentRef, {
        name,
        type: selectedType,
        location,
        status: selectedStatus,
        description,
      });
    }
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setName('');
    setLocation('');
    setDescription('');
    setSelectedType('');
    setSelectedStatus('');
  };

  if (!isOpen) return null; 

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>{equipment ? "Редактировать оборудование" : "Добавить новое оборудование"}</CardTitle>
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
            <Button type="submit" className="w-full">{equipment ? "Сохранить изменения" : "Добавить оборудование"}</Button>
          </form>
          <Button onClick={onClose} className="mt-4">Закрыть</Button> 
        </CardContent>
      </Card>
    </div>
  );
};

export default EquipmentModal;
