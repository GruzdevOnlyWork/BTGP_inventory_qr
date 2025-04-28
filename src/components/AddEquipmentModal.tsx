import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { realtimeDb } from '@/firebase'; 
import { ref, set } from 'firebase/database'; 
import { onValue } from 'firebase/database'; 

interface Equipment {
  id?: string;
  name: string;
  type: string;
  location: string;
  status: string;
  description?: string;
  serialNumber?: string;
  model: string;
}
interface AddEquipmentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddEquipmentModal = ({ isOpen, onClose }: AddEquipmentModalProps) => {
  const [equipmentTypes, setEquipmentTypes] = useState([]);
  const [equipmentStatuses, setEquipmentStatuses] = useState([]);
  
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  
  const [serialNumber, setSerialNumber] = useState('');
  const [model, setModel] = useState('');


  const [errors, setErrors] = useState<{ name?: string; type?: string; status?: string; location?: string; model?: string }>({});

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
      resetForm();
    }
    
  }, [isOpen]);

  
const handleSaveChanges = async (event) => {
    event.preventDefault();

    let validationErrors: { name?: string; type?: string; status?: string; location?: string; model?: string } = {};
    
    if (!name) validationErrors.name = "Название оборудования является обязательным.";
    if (!selectedType) validationErrors.type = "Тип является обязательным.";
    if (!location) validationErrors.location = "Местоположение является обязательным.";
    if (!selectedStatus) validationErrors.status = "Статус является обязательным.";
    if (!model) validationErrors.model = "Модель является обязательной.";

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const newEquipmentRef = ref(realtimeDb, 'equipment/' + Date.now());
      await set(newEquipmentRef, {
        name,
        type: selectedType,
        location,
        status: selectedStatus,
        description,
        serialNumber,
        model,
      });
      console.log("Оборудование успешно добавлено.");
      resetForm();
      onClose();
    } catch (error) {
      console.error("Ошибка при добавлении оборудования:", error);
      alert("Не удалось добавить оборудование. Пожалуйста, попробуйте еще раз.");
    }
};

const resetForm = () => {
    setName('');
    setLocation('');
    setDescription('');
    setSelectedType('');
    setSelectedStatus('');
    setSerialNumber('');
    setModel('');
};

if (!isOpen) return null; 

return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Добавить новое оборудование</CardTitle>
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
                {errors.name && <p className="text-red-500">{errors.name}</p>}
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
                {errors.type && <p className="text-red-500">{errors.type}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Местоположение</Label>
                <Input 
                  id="location" 
                  placeholder="Введите местоположение" 
                  value={location}
                  onChange={(e) => setLocation(e.target.value)} 
                />
                {errors.location && <p className="text-red-500">{errors.location}</p>}
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
                {errors.status && <p className="text-red-500">{errors.status}</p>}
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="serialNumber">Инвентаризационный номер</Label>
                <Input 
                  id="serialNumber" 
                  type="number"
                  placeholder="Введите Инвентаризационный номер"
                  value={serialNumber}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (!value || /^[0-9]*$/.test(value)) { 
                      setSerialNumber(value);
                    }
                  }} 
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="model">Модель</Label>
                <Input 
                  id="model" 
                  placeholder="Введите модель оборудования" 
                  value={model}
                  onChange={(e) => setModel(e.target.value)} 
                />
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

export default AddEquipmentModal;
