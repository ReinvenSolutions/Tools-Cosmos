import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Plane, Calculator, Users, Coins, Receipt, Building, Globe, Briefcase, Network, TrendingUp, User, Star, MapPin, Calendar, Copy, MessageSquare } from "lucide-react";
import { format } from "date-fns";

interface ClientPricing {
  name: string;
  clbCancelable: number;
  color: string;
  icon: JSX.Element;
}

const clients: ClientPricing[] = [
  {
    name: "MAFARA",
    clbCancelable: 320000,
    color: "text-yellow-400",
    icon: <Building className="w-4 h-4" />
  },
  {
    name: "SIN FRONTERAS", 
    clbCancelable: 320000,
    color: "text-green-400",
    icon: <Globe className="w-4 h-4" />
  },
  {
    name: "ARMA TU VIAJE",
    clbCancelable: 250000,
    color: "text-purple-400", 
    icon: <Briefcase className="w-4 h-4" />
  },
  {
    name: "CONEXION",
    clbCancelable: 260000,
    color: "text-red-400",
    icon: <Network className="w-4 h-4" />
  },
  {
    name: "JUAN CARLOS",
    clbCancelable: 300000,
    color: "text-blue-400",
    icon: <User className="w-4 h-4" />
  },
  {
    name: "CIKIS",
    clbCancelable: 260000,
    color: "text-orange-400",
    icon: <Star className="w-4 h-4" />
  },
  {
    name: "AURITOURS",
    clbCancelable: 400000,
    color: "text-teal-400",
    icon: <MapPin className="w-4 h-4" />
  }
];

export default function Dashboard() {
  // Valores configurables por usuario - guardados en localStorage
  const [usdPer1000MilesLifeMiles, setUsdPer1000MilesLifeMiles] = useState<number>(() => {
    const saved = localStorage.getItem('usdPer1000MilesLifeMiles');
    return saved ? parseFloat(saved) : 16.90;
  });
  const [copPerUsdLifeMiles, setCopPerUsdLifeMiles] = useState<number>(() => {
    const saved = localStorage.getItem('copPerUsdLifeMiles');
    return saved ? parseFloat(saved) : 3900;
  });
  const [usdPer1000MilesSmiles, setUsdPer1000MilesSmiles] = useState<number>(() => {
    const saved = localStorage.getItem('usdPer1000MilesSmiles');
    return saved ? parseFloat(saved) : 4.3;
  });
  const [copPerUsdSmiles, setCopPerUsdSmiles] = useState<number>(() => {
    const saved = localStorage.getItem('copPerUsdSmiles');
    return saved ? parseFloat(saved) : 3800;
  });
  const [brlToUsdRate, setBrlToUsdRate] = useState<number>(() => {
    const saved = localStorage.getItem('brlToUsdRate');
    return saved ? parseFloat(saved) : 5.3;
  });

  // Estado para el programa de millas (LIFE MILES o SMILES)
  const [milesProgram, setMilesProgram] = useState<string>('LIFE MILES');
  
  const [miles, setMiles] = useState<number>(0);
  const [milesDisplay, setMilesDisplay] = useState<string>('');
  const [tax, setTax] = useState<number>(0);
  const [taxDisplay, setTaxDisplay] = useState<string>('');
  const [additionalProfit, setAdditionalProfit] = useState<number>(0);
  const [additionalProfitDisplay, setAdditionalProfitDisplay] = useState<string>('');
  const [flightDate, setFlightDate] = useState<string>('');
  const [returnDate, setReturnDate] = useState<string>('');
  const [tariff, setTariff] = useState<string>('Light');
  const [tripType, setTripType] = useState<string>('solo-ida');
  const [origin, setOrigin] = useState<string>('');
  const [destination, setDestination] = useState<string>('');
  const [passengers, setPassengers] = useState<number>(1);
  const [includeCancelable, setIncludeCancelable] = useState<boolean>(true);
  
  // Variables para SMILES - vuelo de ida
  const [realesBRL, setRealesBRL] = useState<number>(0);
  const [realesBRLDisplay, setRealesBRLDisplay] = useState<string>('');
  
  // Variables para vuelo de regreso
  const [milesReturn, setMilesReturn] = useState<number>(0);
  const [milesReturnDisplay, setMilesReturnDisplay] = useState<string>('');
  const [taxReturn, setTaxReturn] = useState<number>(0);
  const [taxReturnDisplay, setTaxReturnDisplay] = useState<string>('');
  const [additionalProfitReturn, setAdditionalProfitReturn] = useState<number>(0);
  const [additionalProfitReturnDisplay, setAdditionalProfitReturnDisplay] = useState<string>('');
  
  // Variables para SMILES - vuelo de regreso
  const [realesBRLReturn, setRealesBRLReturn] = useState<number>(0);
  const [realesBRLReturnDisplay, setRealesBRLReturnDisplay] = useState<string>('');
  
  const { toast } = useToast();

  // Guardar valores configurables en localStorage cuando cambien
  useEffect(() => {
    localStorage.setItem('usdPer1000MilesLifeMiles', usdPer1000MilesLifeMiles.toString());
  }, [usdPer1000MilesLifeMiles]);

  useEffect(() => {
    localStorage.setItem('copPerUsdLifeMiles', copPerUsdLifeMiles.toString());
  }, [copPerUsdLifeMiles]);

  useEffect(() => {
    localStorage.setItem('usdPer1000MilesSmiles', usdPer1000MilesSmiles.toString());
  }, [usdPer1000MilesSmiles]);

  useEffect(() => {
    localStorage.setItem('copPerUsdSmiles', copPerUsdSmiles.toString());
  }, [copPerUsdSmiles]);

  useEffect(() => {
    localStorage.setItem('brlToUsdRate', brlToUsdRate.toString());
  }, [brlToUsdRate]);

  // Sincronizar estado del CLB según el tipo de viaje
  useEffect(() => {
    if (tripType === 'ida-y-vuelta') {
      setIncludeCancelable(false);
    } else if (tripType === 'solo-ida') {
      setIncludeCancelable(true);
    }
  }, [tripType]);

  // Aeropuertos de Colombia y Europa
  const airports = [
    // Colombia - Orden específico: PEI, BOG, CLO, MDE
    { code: 'PEI', name: 'Aeropuerto Internacional Matecaña (Pereira)', country: 'Colombia' },
    { code: 'BOG', name: 'Aeropuerto Internacional El Dorado (Bogotá)', country: 'Colombia' },
    { code: 'CLO', name: 'Aeropuerto Internacional Alfonso Bonilla Aragón (Cali)', country: 'Colombia' },
    { code: 'MDE', name: 'Aeropuerto Internacional José María Córdova (Medellín)', country: 'Colombia' },
    { code: 'CTG', name: 'Aeropuerto Internacional Rafael Núñez (Cartagena)', country: 'Colombia' },
    { code: 'BAQ', name: 'Aeropuerto Internacional Ernesto Cortissoz (Barranquilla)', country: 'Colombia' },
    { code: 'BGA', name: 'Aeropuerto Internacional Palonegro (Bucaramanga)', country: 'Colombia' },
    { code: 'SMR', name: 'Aeropuerto Internacional Simón Bolívar (Santa Marta)', country: 'Colombia' },
    { code: 'ADZ', name: 'Aeropuerto Internacional Gustavo Rojas Pinilla (San Andrés)', country: 'Colombia' },
    { code: 'CUC', name: 'Aeropuerto Internacional Camilo Daza (Cúcuta)', country: 'Colombia' },
    { code: 'AXM', name: 'Aeropuerto Internacional El Edén (Armenia)', country: 'Colombia' },
    { code: 'LET', name: 'Aeropuerto Internacional Alfredo Vásquez Cobo (Leticia)', country: 'Colombia' },
    { code: 'MTR', name: 'Aeropuerto Internacional Los Garzones (Montería)', country: 'Colombia' },
    { code: 'EOH', name: 'Aeropuerto Olaya Herrera (Medellín)', country: 'Colombia' },
    { code: 'PSO', name: 'Aeropuerto Antonio Nariño (Pasto)', country: 'Colombia' },
    // Europa
    { code: 'MAD', name: 'Aeropuerto Adolfo Suárez Madrid-Barajas (Madrid)', country: 'España' },
    { code: 'LHR', name: 'Aeropuerto de Londres-Heathrow (Londres)', country: 'Reino Unido' },
    { code: 'CDG', name: 'Aeropuerto de París-Charles de Gaulle (París)', country: 'Francia' },
    { code: 'AMS', name: 'Aeropuerto de Ámsterdam-Schiphol (Ámsterdam)', country: 'Países Bajos' },
    { code: 'FRA', name: 'Aeropuerto de Fráncfort del Meno (Fráncfort)', country: 'Alemania' },
    { code: 'IST', name: 'Aeropuerto de Estambul (Estambul)', country: 'Turquía' },
    { code: 'BCN', name: 'Aeropuerto Josep Tarradellas Barcelona-El Prat (Barcelona)', country: 'España' },
    { code: 'LGW', name: 'Aeropuerto de Londres-Gatwick (Londres)', country: 'Reino Unido' },
    { code: 'FCO', name: 'Aeropuerto de Roma-Fiumicino "Leonardo da Vinci" (Roma)', country: 'Italia' },
    { code: 'MUC', name: 'Aeropuerto de Múnich (Múnich)', country: 'Alemania' },
    { code: 'ORY', name: 'Aeropuerto de París-Orly (París)', country: 'Francia' },
    { code: 'DUB', name: 'Aeropuerto de Dublín (Dublín)', country: 'Irlanda' },
    { code: 'ZRH', name: 'Aeropuerto de Zúrich (Zúrich)', country: 'Suiza' },
    { code: 'CPH', name: 'Aeropuerto de Copenhague-Kastrup (Copenhague)', country: 'Dinamarca' },
    { code: 'LIS', name: 'Aeropuerto de Lisboa (Lisboa)', country: 'Portugal' },
    { code: 'OSL', name: 'Aeropuerto de Oslo-Gardermoen (Oslo)', country: 'Noruega' },
    { code: 'ARN', name: 'Aeropuerto de Estocolmo-Arlanda (Estocolmo)', country: 'Suecia' },
    { code: 'VIE', name: 'Aeropuerto Internacional de Viena (Viena)', country: 'Austria' },
    { code: 'BRU', name: 'Aeropuerto de Bruselas (Bruselas)', country: 'Bélgica' },
    { code: 'ATH', name: 'Aeropuerto Internacional de Atenas "Eleftherios Venizelos" (Atenas)', country: 'Grecia' }
  ];

  // Lista específica para destinos con aeropuertos internacionales primero
  const destinationAirports = [
    // Europa - Orden específico: MAD, BCN, CDG
    { code: 'MAD', name: 'Aeropuerto Adolfo Suárez Madrid-Barajas (Madrid)', country: 'España' },
    { code: 'BCN', name: 'Aeropuerto Josep Tarradellas Barcelona-El Prat (Barcelona)', country: 'España' },
    { code: 'CDG', name: 'Aeropuerto de París-Charles de Gaulle (París)', country: 'Francia' },
    { code: 'LHR', name: 'Aeropuerto de Londres-Heathrow (Londres)', country: 'Reino Unido' },
    { code: 'AMS', name: 'Aeropuerto de Ámsterdam-Schiphol (Ámsterdam)', country: 'Países Bajos' },
    { code: 'FRA', name: 'Aeropuerto de Fráncfort del Meno (Fráncfort)', country: 'Alemania' },
    { code: 'IST', name: 'Aeropuerto de Estambul (Estambul)', country: 'Turquía' },
    { code: 'LGW', name: 'Aeropuerto de Londres-Gatwick (Londres)', country: 'Reino Unido' },
    { code: 'FCO', name: 'Aeropuerto de Roma-Fiumicino "Leonardo da Vinci" (Roma)', country: 'Italia' },
    { code: 'MUC', name: 'Aeropuerto de Múnich (Múnich)', country: 'Alemania' },
    { code: 'ORY', name: 'Aeropuerto de París-Orly (París)', country: 'Francia' },
    { code: 'DUB', name: 'Aeropuerto de Dublín (Dublín)', country: 'Irlanda' },
    { code: 'ZRH', name: 'Aeropuerto de Zúrich (Zúrich)', country: 'Suiza' },
    { code: 'CPH', name: 'Aeropuerto de Copenhague-Kastrup (Copenhague)', country: 'Dinamarca' },
    { code: 'LIS', name: 'Aeropuerto de Lisboa (Lisboa)', country: 'Portugal' },
    { code: 'OSL', name: 'Aeropuerto de Oslo-Gardermoen (Oslo)', country: 'Noruega' },
    { code: 'ARN', name: 'Aeropuerto de Estocolmo-Arlanda (Estocolmo)', country: 'Suecia' },
    { code: 'VIE', name: 'Aeropuerto Internacional de Viena (Viena)', country: 'Austria' },
    { code: 'BRU', name: 'Aeropuerto de Bruselas (Bruselas)', country: 'Bélgica' },
    { code: 'ATH', name: 'Aeropuerto Internacional de Atenas "Eleftherios Venizelos" (Atenas)', country: 'Grecia' },
    // Colombia (Aeropuertos Nacionales)
    { code: 'PEI', name: 'Aeropuerto Internacional Matecaña (Pereira)', country: 'Colombia' },
    { code: 'BOG', name: 'Aeropuerto Internacional El Dorado (Bogotá)', country: 'Colombia' },
    { code: 'MDE', name: 'Aeropuerto Internacional José María Córdova (Medellín)', country: 'Colombia' },
    { code: 'CLO', name: 'Aeropuerto Internacional Alfonso Bonilla Aragón (Cali)', country: 'Colombia' },
    { code: 'CTG', name: 'Aeropuerto Internacional Rafael Núñez (Cartagena)', country: 'Colombia' },
    { code: 'BAQ', name: 'Aeropuerto Internacional Ernesto Cortissoz (Barranquilla)', country: 'Colombia' },
    { code: 'BGA', name: 'Aeropuerto Internacional Palonegro (Bucaramanga)', country: 'Colombia' },
    { code: 'SMR', name: 'Aeropuerto Internacional Simón Bolívar (Santa Marta)', country: 'Colombia' },
    { code: 'ADZ', name: 'Aeropuerto Internacional Gustavo Rojas Pinilla (San Andrés)', country: 'Colombia' },
    { code: 'CUC', name: 'Aeropuerto Internacional Camilo Daza (Cúcuta)', country: 'Colombia' },
    { code: 'AXM', name: 'Aeropuerto Internacional El Edén (Armenia)', country: 'Colombia' },
    { code: 'LET', name: 'Aeropuerto Internacional Alfredo Vásquez Cobo (Leticia)', country: 'Colombia' },
    { code: 'MTR', name: 'Aeropuerto Internacional Los Garzones (Montería)', country: 'Colombia' },
    { code: 'EOH', name: 'Aeropuerto Olaya Herrera (Medellín)', country: 'Colombia' },
    { code: 'PSO', name: 'Aeropuerto Antonio Nariño (Pasto)', country: 'Colombia' }
  ];
  
  const CANCELABLE_COST = 170000; // Costo del cancelable: 170,000 COP
  
  // Cálculos del vuelo de ida según el programa
  let milesInUSD = 0;
  let milesInCOP = 0;
  let totalFlightOutbound = 0;
  let costoMillasUSD = 0;
  let impuestosUSD = 0;
  let totalVueloUSD = 0;
  
  if (milesProgram === 'LIFE MILES') {
    milesInUSD = (miles * usdPer1000MilesLifeMiles) / 1000;
    milesInCOP = milesInUSD * copPerUsdLifeMiles;
    totalFlightOutbound = (milesInCOP + tax + additionalProfit) * passengers;
  } else { // SMILES
    // NOTA: En SMILES, las millas se ingresan en miles (ej: 156.4 = 156,400 millas)
    // Por eso NO dividimos por 1000
    
    // Paso 1: Costo de Millas en USD (Fórmula: B5 * C5)
    // El input 'miles' ya representa miles de millas (156.4 = 156,400 millas)
    costoMillasUSD = (miles / 1000) * usdPer1000MilesSmiles;
    
    // Paso 2: Impuestos de BRL a USD (Fórmula: F5 / E5)
    impuestosUSD = realesBRL / brlToUsdRate;
    
    // Paso 3: Total en USD (Fórmula: D5 + G5)
    totalVueloUSD = costoMillasUSD + impuestosUSD;
    
    // Paso 4: Total en COP (Fórmula: H5 * COP_PER_USD)
    milesInCOP = totalVueloUSD * copPerUsdSmiles;
    
    totalFlightOutbound = (milesInCOP + additionalProfit) * passengers;
  }
  
  // Cálculos del vuelo de regreso según el programa
  let milesReturnInUSD = 0;
  let milesReturnInCOP = 0;
  let totalFlightReturn = 0;
  let costoMillasUSDReturn = 0;
  let impuestosUSDReturn = 0;
  let totalVueloUSDReturn = 0;
  
  if (milesProgram === 'LIFE MILES') {
    milesReturnInUSD = (milesReturn * usdPer1000MilesLifeMiles) / 1000;
    milesReturnInCOP = milesReturnInUSD * copPerUsdLifeMiles;
    totalFlightReturn = (milesReturnInCOP + taxReturn + additionalProfitReturn) * passengers;
  } else { // SMILES
    // NOTA: En SMILES, las millas se ingresan en miles (ej: 156.4 = 156,400 millas)
    
    // Paso 1: Costo de Millas en USD (Fórmula: B5 * C5)
    costoMillasUSDReturn = (milesReturn / 1000) * usdPer1000MilesSmiles;
    
    // Paso 2: Impuestos de BRL a USD (Fórmula: F5 / E5)
    impuestosUSDReturn = realesBRLReturn / brlToUsdRate;
    
    // Paso 3: Total en USD (Fórmula: D5 + G5)
    totalVueloUSDReturn = costoMillasUSDReturn + impuestosUSDReturn;
    
    // Paso 4: Total en COP (Fórmula: H5 * COP_PER_USD)
    milesReturnInCOP = totalVueloUSDReturn * copPerUsdSmiles;
    
    totalFlightReturn = (milesReturnInCOP + additionalProfitReturn) * passengers;
  }
  
  // Total combinado según tipo de viaje
  const totalFlight = tripType === 'ida-y-vuelta' ? totalFlightOutbound + totalFlightReturn : totalFlightOutbound;
  
  const roundToTens = (value: number): number => {
    return Math.ceil(value / 10000) * 10000;
  };

  const formatCurrency = (value: number): string => {
    const roundedValue = roundToTens(value);
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(roundedValue);
  };

  const formatUSD = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  const formatNumber = (value: number): string => {
    return new Intl.NumberFormat('es-CO').format(value);
  };

  const parseNumber = (value: string): number => {
    return parseInt(value.replace(/\D/g, '')) || 0;
  };

  // Función para parsear números con decimales en formato español (ej: 2.946,11)
  const parseDecimalNumber = (value: string): number => {
    if (!value) return 0;
    
    // Eliminar espacios
    let cleanValue = value.trim();
    
    // Reemplazar puntos (separadores de miles) por nada
    cleanValue = cleanValue.replace(/\./g, '');
    
    // Reemplazar coma (separador decimal) por punto
    cleanValue = cleanValue.replace(',', '.');
    
    // Parsear como float
    const parsed = parseFloat(cleanValue);
    
    return isNaN(parsed) ? 0 : parsed;
  };

  // Función para formatear números con decimales en formato español
  const formatDecimalNumber = (value: number): string => {
    if (value === 0) return '';
    return new Intl.NumberFormat('es-CO', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(value);
  };

  const handleMilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const numericValue = parseNumber(inputValue);
    setMiles(numericValue);
    setMilesDisplay(formatNumber(numericValue));
  };

  const handleTaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const numericValue = parseNumber(inputValue);
    setTax(numericValue);
    setTaxDisplay(formatNumber(numericValue));
  };

  const handleAdditionalProfitChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const numericValue = parseNumber(inputValue);
    setAdditionalProfit(numericValue);
    setAdditionalProfitDisplay(formatNumber(numericValue));
  };

  // Funciones de manejo para vuelo de regreso
  const handleMilesReturnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const numericValue = parseNumber(inputValue);
    setMilesReturn(numericValue);
    setMilesReturnDisplay(formatNumber(numericValue));
  };

  const handleTaxReturnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const numericValue = parseNumber(inputValue);
    setTaxReturn(numericValue);
    setTaxReturnDisplay(formatNumber(numericValue));
  };

  const handleAdditionalProfitReturnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const numericValue = parseNumber(inputValue);
    setAdditionalProfitReturn(numericValue);
    setAdditionalProfitReturnDisplay(formatNumber(numericValue));
  };
  
  // Funciones de manejo para SMILES - Reales BRL
  const handleRealesBRLChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const numericValue = parseDecimalNumber(inputValue);
    setRealesBRL(numericValue);
    setRealesBRLDisplay(formatDecimalNumber(numericValue));
  };
  
  const handleRealesBRLReturnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const numericValue = parseDecimalNumber(inputValue);
    setRealesBRLReturn(numericValue);
    setRealesBRLReturnDisplay(formatDecimalNumber(numericValue));
  };
  
  const generatePersonalizedMessage = (client: ClientPricing) => {
    // CLB se anula completamente en ida y vuelta
    const clientCLBTotal = (tripType === 'solo-ida' && includeCancelable) ? client.clbCancelable * passengers : 0;
    const clientTotal = totalFlight + clientCLBTotal;
    const includesCLB = (tripType === 'solo-ida' && includeCancelable) ? '\nINCLUYE CLB' : '';
    
    // Arreglar el problema de zona horaria parseando la fecha manualmente
    let formattedDate = '';
    if (flightDate) {
      const [year, month, day] = flightDate.split('-');
      formattedDate = `${day}/${month}/${year}`;
    }
    
    // Formatear fecha de regreso si existe
    let formattedReturnDate = '';
    if (tripType === 'ida-y-vuelta' && returnDate) {
      const [year, month, day] = returnDate.split('-');
      formattedReturnDate = `${day}/${month}/${year}`;
    }
    
    const route = origin && destination ? `${origin} - ${destination}` : '';
    const tripTypeText = tripType === 'ida-y-vuelta' ? 'Ida y Vuelta' : '';
    
    let message = formattedDate;
    if (tripType === 'ida-y-vuelta' && formattedReturnDate) {
      message += ` - ${formattedReturnDate}`;
    }
    if (route) message += `\n${route}`;
    if (tripTypeText) message += `\n${tripTypeText}`;
    if (passengers > 1) message += `\n${passengers} PAX`;
    message += `\nTarifa ${tariff}`;
    
    // Para ida y vuelta, mostrar el total que incluye ambos vuelos
    if (tripType === 'ida-y-vuelta') {
      message += `\n${formatCurrency(clientTotal)}`;
    } else {
      message += `\n${formatCurrency(clientTotal)}${includesCLB}`;
    }
    
    return message;
  };
  
  const copyToClipboard = async (client: ClientPricing) => {
    const message = generatePersonalizedMessage(client);
    try {
      await navigator.clipboard.writeText(message);
      toast({
        title: "¡Copiado!",
        description: `Mensaje de ${client.name} copiado al portapapeles`,
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "No se pudo copiar el mensaje",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Configuración de Valores - Solo visible en Cotizador */}
        <div className="mb-4 bg-gradient-to-r from-blue-600/10 to-purple-600/10 border-2 border-blue-500/30 rounded-lg p-4">
          <div className="flex items-center mb-3">
            <TrendingUp className="text-blue-500 mr-2" size={20} />
            <h3 className="text-sm font-bold text-foreground">Configuración de Tasas</h3>
            <span className="ml-2 text-xs text-muted-foreground">(Valores personalizados por usuario)</span>
          </div>
          
          {milesProgram === 'LIFE MILES' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="usdPerMilesLifeMiles" className="text-xs font-medium text-foreground mb-1 block">
                  Valor USD por 1,000 Millas
                </Label>
                <Input
                  id="usdPerMilesLifeMiles"
                  type="number"
                  step="0.01"
                  value={usdPer1000MilesLifeMiles}
                  onChange={(e) => setUsdPer1000MilesLifeMiles(parseFloat(e.target.value) || 0)}
                  className="input-field h-9"
                  placeholder="16.90"
                />
              </div>
              <div>
                <Label htmlFor="copPerUsdLifeMiles" className="text-xs font-medium text-foreground mb-1 block">
                  TRM - COP por USD
                </Label>
                <Input
                  id="copPerUsdLifeMiles"
                  type="number"
                  step="1"
                  value={copPerUsdLifeMiles}
                  onChange={(e) => setCopPerUsdLifeMiles(parseFloat(e.target.value) || 0)}
                  className="input-field h-9"
                  placeholder="3900"
                />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="usdPerMilesSmiles" className="text-xs font-medium text-foreground mb-1 block">
                  Valor USD por 1,000 Millas
                </Label>
                <Input
                  id="usdPerMilesSmiles"
                  type="number"
                  step="0.01"
                  value={usdPer1000MilesSmiles}
                  onChange={(e) => setUsdPer1000MilesSmiles(parseFloat(e.target.value) || 0)}
                  className="input-field h-9"
                  placeholder="4.30"
                />
              </div>
              <div>
                <Label htmlFor="brlToUsdRate" className="text-xs font-medium text-foreground mb-1 block">
                  Tasa BRL a USD
                </Label>
                <Input
                  id="brlToUsdRate"
                  type="number"
                  step="0.1"
                  value={brlToUsdRate}
                  onChange={(e) => setBrlToUsdRate(parseFloat(e.target.value) || 0)}
                  className="input-field h-9"
                  placeholder="5.3"
                />
              </div>
              <div>
                <Label htmlFor="copPerUsdSmiles" className="text-xs font-medium text-foreground mb-1 block">
                  TRM - COP por USD
                </Label>
                <Input
                  id="copPerUsdSmiles"
                  type="number"
                  step="1"
                  value={copPerUsdSmiles}
                  onChange={(e) => setCopPerUsdSmiles(parseFloat(e.target.value) || 0)}
                  className="input-field h-9"
                  placeholder="3800"
                />
              </div>
            </div>
          )}
        </div>

        {/* Header Info */}
        <div className="mb-6 bg-card border border-border rounded-lg p-4">
          <div className="flex flex-col space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                <Plane className="text-primary-foreground" size={20} />
              </div>
              <div className="min-w-0">
                <h1 className="text-lg sm:text-xl font-bold text-foreground">Cotizador de Millas Cosmos</h1>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  {milesProgram === 'LIFE MILES' ? 'Canal Millas / Avianca' : 'GOL - SMILES'}
                </p>
              </div>
            </div>
            
            {/* Fórmula de Cálculo */}
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <Calculator className="text-primary flex-shrink-0 mt-0.5" size={16} />
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-foreground">Fórmula de Cálculo:</p>
                  {milesProgram === 'LIFE MILES' ? (
                    <div className="text-xs text-muted-foreground space-y-0.5">
                      <p>• Millas: (Total Millas × ${usdPer1000MilesLifeMiles.toFixed(2)} USD) ÷ 1,000 × ${copPerUsdLifeMiles.toLocaleString()} COP</p>
                      <p>• Total: Millas + Impuestos + Ganancia</p>
                    </div>
                  ) : (
                    <div className="text-xs text-muted-foreground space-y-0.5">
                      <p>1. Millas USD = (Millas ÷ 1,000) × ${usdPer1000MilesSmiles.toFixed(2)}</p>
                      <p>2. Impuestos USD = BRL ÷ {brlToUsdRate.toFixed(1)}</p>
                      <p>3. Total USD = Millas USD + Impuestos USD</p>
                      <p>4. Total COP = Total USD × ${copPerUsdSmiles.toLocaleString()}</p>
                      <p className="text-[10px] italic mt-1">* Las millas se dividen entre 1,000 (ej: 156,400 → 156.4)</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Flight Data Section */}
        <div className="mb-6 sm:mb-8">
          <Card className="border border-border">
            <CardContent className="p-4 sm:p-6 lg:p-8">
              <div className="flex items-center mb-6">
                <Calendar className="text-primary mr-3" size={24} />
                <h2 className="text-2xl font-bold text-foreground">Datos del Vuelo</h2>
              </div>
              
              <div className="space-y-6">
                {/* Programa de Millas, Tipo de Viaje y Pasajeros - Primera Fila */}
                <div className="bg-primary/10 p-4 rounded-[40px] border border-primary/20">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div>
                      <Label className="block text-sm font-medium text-foreground mb-3">
                        <div className="flex items-center">
                          <Coins className="text-accent mr-2" size={16} />
                          Programa de Millas
                        </div>
                      </Label>
                      <div className="space-y-3">
                        <div className="text-center">
                          <h3 className="text-xl font-bold text-foreground mb-2">
                            {milesProgram === 'LIFE MILES' ? 'LIFE MILES' : 'SMILES'}
                          </h3>
                        </div>
                        <div className="flex items-center justify-center space-x-3">
                          <button
                            onClick={() => setMilesProgram('LIFE MILES')}
                            className={`px-6 py-2 rounded-lg font-medium transition-all ${
                              milesProgram === 'LIFE MILES'
                                ? 'bg-red-600 text-white shadow-lg scale-105'
                                : 'bg-muted text-muted-foreground hover:bg-muted/80'
                            }`}
                            data-testid="toggle-lifemiles"
                          >
                            LIFE MILES
                          </button>
                          <button
                            onClick={() => setMilesProgram('SMILES')}
                            className={`px-6 py-2 rounded-lg font-medium transition-all ${
                              milesProgram === 'SMILES'
                                ? 'bg-orange-600 text-white shadow-lg scale-105'
                                : 'bg-muted text-muted-foreground hover:bg-muted/80'
                            }`}
                            data-testid="toggle-smiles"
                          >
                            SMILES
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <Label className="block text-sm font-medium text-foreground mb-3">
                        <div className="flex items-center">
                          <Receipt className="text-accent mr-2" size={16} />
                          Modalidad
                        </div>
                      </Label>
                      <RadioGroup value={tripType} onValueChange={setTripType} className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-6">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="solo-ida" id="solo-ida" data-testid="radio-solo-ida" />
                          <Label htmlFor="solo-ida" className="text-foreground">Solo ida</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="ida-y-vuelta" id="ida-y-vuelta" data-testid="radio-ida-vuelta" />
                          <Label htmlFor="ida-y-vuelta" className="text-foreground">Ida y vuelta</Label>
                        </div>
                      </RadioGroup>
                    </div>
                    
                    <div>
                      <Label className="block text-sm font-medium text-foreground mb-3">
                        <div className="flex items-center">
                          <Users className="text-accent mr-2" size={16} />
                          Pasajeros
                        </div>
                      </Label>
                      <Select value={passengers.toString()} onValueChange={(value) => setPassengers(parseInt(value))}>
                        <SelectTrigger className="input-field" data-testid="select-passengers">
                          <SelectValue placeholder="Número de pasajeros" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 Pasajero</SelectItem>
                          <SelectItem value="2">2 Pasajeros</SelectItem>
                          <SelectItem value="3">3 Pasajeros</SelectItem>
                          <SelectItem value="4">4 Pasajeros</SelectItem>
                          <SelectItem value="5">5 Pasajeros</SelectItem>
                          <SelectItem value="6">6 Pasajeros</SelectItem>
                          <SelectItem value="7">7 Pasajeros</SelectItem>
                          <SelectItem value="8">8 Pasajeros</SelectItem>
                          <SelectItem value="9">9 Pasajeros</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Segunda Fila: Origen, Destino, Fecha, Tarifa */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                  <div>
                    <Label className="block text-sm font-medium text-foreground mb-2">
                      <div className="flex items-center">
                        <Plane className="text-accent mr-2" size={16} />
                        Origen
                      </div>
                    </Label>
                    <Select value={origin} onValueChange={setOrigin}>
                      <SelectTrigger className="input-field" data-testid="select-origin">
                        <SelectValue placeholder="Seleccionar origen" />
                      </SelectTrigger>
                      <SelectContent className="max-h-60 overflow-auto">
                        {airports.map((airport) => (
                          <SelectItem key={airport.code} value={airport.code}>
                            {airport.code} - {airport.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label className="block text-sm font-medium text-foreground mb-2">
                      <div className="flex items-center">
                        <Plane className="text-accent mr-2" size={16} />
                        Destino
                      </div>
                    </Label>
                    <Select value={destination} onValueChange={setDestination}>
                      <SelectTrigger className="input-field" data-testid="select-destination">
                        <SelectValue placeholder="Seleccionar destino" />
                      </SelectTrigger>
                      <SelectContent className="max-h-60 overflow-auto">
                        {destinationAirports.map((airport) => (
                          <SelectItem key={airport.code} value={airport.code}>
                            {airport.code} - {airport.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="flightDate" className="block text-sm font-medium text-foreground mb-2">
                      <div className="flex items-center">
                        <Calendar className="text-accent mr-2" size={16} />
                        {tripType === 'ida-y-vuelta' ? 'Fecha de Ida' : 'Fecha del Vuelo'}
                      </div>
                    </Label>
                    <Input 
                      type="date" 
                      id="flightDate" 
                      data-testid="input-flight-date"
                      className="input-field"
                      value={flightDate}
                      onChange={(e) => setFlightDate(e.target.value)}
                    />
                  </div>

                  {tripType === 'ida-y-vuelta' && (
                    <div>
                      <Label htmlFor="returnDate" className="block text-sm font-medium text-foreground mb-2">
                        <div className="flex items-center">
                          <Calendar className="text-accent mr-2" size={16} />
                          Fecha de Regreso
                        </div>
                      </Label>
                      <Input 
                        type="date" 
                        id="returnDate" 
                        data-testid="input-return-date"
                        className="input-field"
                        value={returnDate}
                        onChange={(e) => setReturnDate(e.target.value)}
                      />
                    </div>
                  )}
                  
                  <div>
                    <Label className="block text-sm font-medium text-foreground mb-2">
                      <div className="flex items-center">
                        <Plane className="text-accent mr-2" size={16} />
                        Tarifa
                      </div>
                    </Label>
                    <Select value={tariff} onValueChange={setTariff}>
                      <SelectTrigger className="input-field" data-testid="select-tariff">
                        <SelectValue placeholder="Seleccione tarifa" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Light">Light</SelectItem>
                        <SelectItem value="Classic">Classic</SelectItem>
                        <SelectItem value="Flex">Flex</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Calculator Section */}
        <div className="mb-6 sm:mb-8">
          <Card className="calculator-card border border-border">
            <CardContent className="p-4 sm:p-6 lg:p-8">
              <div className="flex items-center mb-6">
                <Plane className="text-primary mr-3" size={24} />
                <h2 className="text-2xl font-bold text-foreground">Vuelo de Ida</h2>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                {/* Input Section */}
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="miles" className="block text-sm font-medium text-foreground mb-2">
                      <div className="flex items-center">
                        <Coins className="text-accent mr-2" size={16} />
                        Cantidad de Millas
                      </div>
                    </Label>
                    <Input 
                      type="text" 
                      id="miles" 
                      data-testid="input-miles"
                      placeholder={milesProgram === 'SMILES' ? "Ej: 156,400 millas" : "Ej: 28,000 millas"}
                      className="input-field"
                      value={milesDisplay}
                      onChange={handleMilesChange}
                    />
                    {milesProgram === 'SMILES' && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Ingrese el número total de millas (se dividirá automáticamente entre 1,000)
                      </p>
                    )}
                  </div>
                  
                  {milesProgram === 'LIFE MILES' ? (
                    <div>
                      <Label htmlFor="tax" className="block text-sm font-medium text-foreground mb-2">
                        <div className="flex items-center">
                          <Receipt className="text-accent mr-2" size={16} />
                          Impuesto (COP)
                        </div>
                      </Label>
                      <Input 
                        type="text" 
                        id="tax" 
                        data-testid="input-tax"
                        placeholder="Ingrese el impuesto (ej: 150,000)"
                        className="input-field"
                        value={taxDisplay}
                        onChange={handleTaxChange}
                      />
                    </div>
                  ) : (
                    <div>
                      <Label htmlFor="realesBRL" className="block text-sm font-medium text-foreground mb-2">
                        <div className="flex items-center">
                          <Receipt className="text-accent mr-2" size={16} />
                          Impuesto en Reales (BRL)
                        </div>
                      </Label>
                      <Input 
                        type="text" 
                        id="realesBRL" 
                        data-testid="input-reales-brl"
                        placeholder="Ingrese el valor en reales (ej: 2.946,11)"
                        className="input-field"
                        value={realesBRLDisplay}
                        onChange={handleRealesBRLChange}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Se convertirá automáticamente a USD (BRL ÷ 5.3). Formato: 2.946,11
                      </p>
                    </div>
                  )}
                  
                  <div>
                    <Label htmlFor="additionalProfit" className="block text-sm font-medium text-foreground mb-2">
                      <div className="flex items-center">
                        <TrendingUp className="text-accent mr-2" size={16} />
                        Ganancia Adicional (COP) - Opcional
                      </div>
                    </Label>
                    <Input 
                      type="text" 
                      id="additionalProfit" 
                      data-testid="input-additional-profit"
                      placeholder="Ingrese ganancia adicional (ej: 50,000)"
                      className="input-field"
                      value={additionalProfitDisplay}
                      onChange={handleAdditionalProfitChange}
                    />
                  </div>
                  
                  {/* Incluye Cancelable Toggle - Para ambos programas */}
                  <div>
                    <Label className="block text-sm font-medium text-foreground mb-2">
                      <div className="flex items-center">
                        <Calculator className="text-accent mr-2" size={16} />
                        Incluye Cancelable
                      </div>
                    </Label>
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => setIncludeCancelable(true)}
                        disabled={tripType === 'ida-y-vuelta'}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                          tripType === 'ida-y-vuelta' 
                            ? 'bg-gray-500 text-gray-300 cursor-not-allowed'
                            : includeCancelable
                            ? 'bg-green-600 text-white'
                            : 'bg-muted text-muted-foreground hover:bg-muted/80'
                        }`}
                        data-testid="toggle-cancelable-yes"
                      >
                        Si
                      </button>
                      <button
                        onClick={() => setIncludeCancelable(false)}
                        disabled={tripType === 'ida-y-vuelta'}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                          tripType === 'ida-y-vuelta'
                            ? 'bg-red-600 text-white cursor-not-allowed'
                            : !includeCancelable
                            ? 'bg-red-600 text-white'
                            : 'bg-muted text-muted-foreground hover:bg-muted/80'
                        }`}
                        data-testid="toggle-cancelable-no"
                      >
                        No
                      </button>
                    </div>
                    {tripType === 'ida-y-vuelta' && (
                      <p className="text-xs text-muted-foreground mt-2">
                        CLB deshabilitado en ida y vuelta (no hay cancelable de regreso)
                      </p>
                    )}
                  </div>
                </div>
                
                {/* Results Section */}
                <div className="space-y-4">
                  {milesProgram === 'SMILES' ? (
                    <>
                      {/* Desglose detallado para SMILES */}
                      <div className="bg-muted rounded-lg p-4">
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-sm font-medium text-muted-foreground">Desglose en USD</span>
                          <Coins className="text-accent" size={16} />
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">1. Costo Millas:</span>
                            <span className="font-medium">${costoMillasUSD.toFixed(2)} USD</span>
                          </div>
                          <div className="text-xs text-muted-foreground ml-4 -mt-1 mb-2">
                            ({miles.toLocaleString()} ÷ 1,000) × ${usdPer1000MilesSmiles.toFixed(2)} = {(miles / 1000).toFixed(1)} × ${usdPer1000MilesSmiles.toFixed(2)}
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">2. Impuestos BRL → USD:</span>
                            <span className="font-medium">${impuestosUSD.toFixed(2)} USD</span>
                          </div>
                          <div className="text-xs text-muted-foreground ml-4 -mt-1 mb-2">
                            {realesBRL.toLocaleString()} ÷ {brlToUsdRate.toFixed(1)}
                          </div>
                          <div className="border-t border-border pt-2 mt-2">
                            <div className="flex justify-between">
                              <span className="font-medium text-foreground">3. Total USD:</span>
                              <span className="font-bold text-primary">${totalVueloUSD.toFixed(2)} USD</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-primary/10 rounded-lg p-4 border border-primary/20">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-foreground">4. Total en COP</span>
                          <Coins className="text-primary" size={16} />
                        </div>
                        <div className="bg-background rounded-md px-3 py-2">
                          <span data-testid="text-miles-value" className="text-lg font-bold text-foreground">{formatCurrency(milesInCOP)}</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                          ${totalVueloUSD.toFixed(2)} USD × ${copPerUsdSmiles.toLocaleString()} COP/USD
                        </p>
                      </div>
                    </>
                  ) : (
                    <div className="bg-muted rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-muted-foreground">Valor en Millas</span>
                        <Coins className="text-accent" size={16} />
                      </div>
                      <div className="currency-display rounded-md px-3 py-2">
                        <span data-testid="text-miles-value" className="text-lg font-bold">{formatCurrency(milesInCOP)}</span>
                      </div>
                    </div>
                  )}
                  
                  {milesProgram === 'LIFE MILES' && (
                    <div className="bg-muted rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-muted-foreground">Impuesto</span>
                        <Receipt className="text-accent" size={16} />
                      </div>
                      <div className="bg-secondary rounded-md px-3 py-2">
                        <span data-testid="text-tax-value" className="text-lg font-bold text-foreground">{formatCurrency(tax)}</span>
                      </div>
                    </div>
                  )}
                  
                  <div className="bg-gradient-to-r from-primary to-blue-600 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-primary-foreground">
                        {tripType === 'ida-y-vuelta' ? 'Total Vuelo de Ida' : 'Total del Vuelo'}{passengers > 1 ? ` (${passengers} pax)` : ''}
                      </span>
                      <div className="flex items-center space-x-2">
                        {passengers > 1 && (
                          <span className="text-xs font-bold text-primary-foreground bg-white/20 px-2 py-1 rounded-full">
                            X{passengers}
                          </span>
                        )}
                        <Plane className="text-primary-foreground" size={16} />
                      </div>
                    </div>
                    <div className="bg-white bg-opacity-20 rounded-md px-3 py-2">
                      <span data-testid="text-total-flight" className="text-xl font-bold text-primary-foreground">
                        {tripType === 'ida-y-vuelta' ? formatCurrency(totalFlightOutbound) : formatCurrency(totalFlight)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Módulo de Vuelo de Regreso */}
        {tripType === 'ida-y-vuelta' && (
          <div className="mb-6 sm:mb-8">
            <Card className="calculator-card border border-border">
              <CardContent className="p-4 sm:p-6 lg:p-8">
                <div className="flex items-center mb-6">
                  <Plane className="text-primary mr-3" size={24} style={{ transform: 'scaleX(-1)' }} />
                  <h2 className="text-2xl font-bold text-foreground">Vuelo de Regreso</h2>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                  {/* Input Section para Vuelo de Regreso */}
                  <div className="space-y-6">
                    <div>
                      <Label htmlFor="milesReturn" className="block text-sm font-medium text-foreground mb-2">
                        <div className="flex items-center">
                          <Coins className="text-accent mr-2" size={16} />
                          Cantidad de Millas (Regreso)
                        </div>
                      </Label>
                      <Input 
                        type="text" 
                        id="milesReturn" 
                        data-testid="input-miles-return"
                        placeholder={milesProgram === 'SMILES' ? "Ej: 156,400 millas" : "Ej: 28,000 millas"}
                        className="input-field"
                        value={milesReturnDisplay}
                        onChange={handleMilesReturnChange}
                      />
                      {milesProgram === 'SMILES' && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Ingrese el número total de millas (se dividirá automáticamente entre 1,000)
                        </p>
                      )}
                    </div>
                    
                    {milesProgram === 'LIFE MILES' ? (
                      <div>
                        <Label htmlFor="taxReturn" className="block text-sm font-medium text-foreground mb-2">
                          <div className="flex items-center">
                            <Receipt className="text-accent mr-2" size={16} />
                            Impuesto (COP) - Regreso
                          </div>
                        </Label>
                        <Input 
                          type="text" 
                          id="taxReturn" 
                          data-testid="input-tax-return"
                          placeholder="Ingrese el impuesto (ej: 150,000)"
                          className="input-field"
                          value={taxReturnDisplay}
                          onChange={handleTaxReturnChange}
                        />
                      </div>
                    ) : (
                      <div>
                        <Label htmlFor="realesBRLReturn" className="block text-sm font-medium text-foreground mb-2">
                          <div className="flex items-center">
                            <Receipt className="text-accent mr-2" size={16} />
                            Impuesto en Reales (BRL) - Regreso
                          </div>
                        </Label>
                        <Input 
                          type="text" 
                          id="realesBRLReturn" 
                          data-testid="input-reales-brl-return"
                          placeholder="Ingrese el valor en reales (ej: 2.946,11)"
                          className="input-field"
                          value={realesBRLReturnDisplay}
                          onChange={handleRealesBRLReturnChange}
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Se convertirá automáticamente a USD (BRL ÷ 5.3). Formato: 2.946,11
                        </p>
                      </div>
                    )}
                    
                    <div>
                      <Label htmlFor="additionalProfitReturn" className="block text-sm font-medium text-foreground mb-2">
                        <div className="flex items-center">
                          <TrendingUp className="text-accent mr-2" size={16} />
                          Ganancia Adicional (COP) - Regreso
                        </div>
                      </Label>
                      <Input 
                        type="text" 
                        id="additionalProfitReturn" 
                        data-testid="input-additional-profit-return"
                        placeholder="Ingrese ganancia adicional (ej: 50,000)"
                        className="input-field"
                        value={additionalProfitReturnDisplay}
                        onChange={handleAdditionalProfitReturnChange}
                      />
                    </div>
                  </div>
                  
                  {/* Results Section para Vuelo de Regreso */}
                  <div className="space-y-4">
                    {milesProgram === 'SMILES' ? (
                      <>
                        {/* Desglose detallado para SMILES - Regreso */}
                        <div className="bg-muted rounded-lg p-4">
                          <div className="flex justify-between items-center mb-3">
                            <span className="text-sm font-medium text-muted-foreground">Desglose en USD (Regreso)</span>
                            <Coins className="text-accent" size={16} />
                          </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">1. Costo Millas:</span>
                            <span className="font-medium">${costoMillasUSDReturn.toFixed(2)} USD</span>
                          </div>
                          <div className="text-xs text-muted-foreground ml-4 -mt-1 mb-2">
                            ({milesReturn.toLocaleString()} ÷ 1,000) × ${usdPer1000MilesSmiles.toFixed(2)} = {(milesReturn / 1000).toFixed(1)} × ${usdPer1000MilesSmiles.toFixed(2)}
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">2. Impuestos BRL → USD:</span>
                            <span className="font-medium">${impuestosUSDReturn.toFixed(2)} USD</span>
                          </div>
                          <div className="text-xs text-muted-foreground ml-4 -mt-1 mb-2">
                            {realesBRLReturn.toLocaleString()} ÷ {brlToUsdRate.toFixed(1)}
                          </div>
                          <div className="border-t border-border pt-2 mt-2">
                            <div className="flex justify-between">
                              <span className="font-medium text-foreground">3. Total USD:</span>
                              <span className="font-bold text-primary">${totalVueloUSDReturn.toFixed(2)} USD</span>
                            </div>
                          </div>
                        </div>
                        </div>
                        
                        <div className="bg-purple-500/10 rounded-lg p-4 border border-purple-500/20">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium text-foreground">4. Total en COP (Regreso)</span>
                            <Coins className="text-purple-500" size={16} />
                          </div>
                          <div className="bg-background rounded-md px-3 py-2">
                            <span data-testid="text-miles-value-return" className="text-lg font-bold text-foreground">{formatCurrency(milesReturnInCOP)}</span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-2">
                            ${totalVueloUSDReturn.toFixed(2)} USD × ${copPerUsdSmiles.toLocaleString()} COP/USD
                          </p>
                        </div>
                      </>
                    ) : (
                      <div className="bg-muted rounded-lg p-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-muted-foreground">Valor en Millas (Regreso)</span>
                          <Coins className="text-accent" size={16} />
                        </div>
                        <div className="currency-display rounded-md px-3 py-2">
                          <span data-testid="text-miles-value-return" className="text-lg font-bold">{formatCurrency(milesReturnInCOP)}</span>
                        </div>
                      </div>
                    )}
                    
                    {milesProgram === 'LIFE MILES' && (
                      <div className="bg-muted rounded-lg p-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-muted-foreground">Impuesto (Regreso)</span>
                          <Receipt className="text-accent" size={16} />
                        </div>
                        <div className="bg-secondary rounded-md px-3 py-2">
                          <span data-testid="text-tax-value-return" className="text-lg font-bold text-foreground">{formatCurrency(taxReturn)}</span>
                        </div>
                      </div>
                    )}
                    
                    <div className="bg-gradient-to-r from-secondary to-purple-600 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-secondary-foreground">Total Vuelo Regreso{passengers > 1 ? ` (${passengers} pax)` : ''}</span>
                        <div className="flex items-center space-x-2">
                          {passengers > 1 && (
                            <span className="text-xs font-bold text-secondary-foreground bg-white/20 px-2 py-1 rounded-full">
                              X{passengers}
                            </span>
                          )}
                          <Plane className="text-secondary-foreground" size={16} />
                        </div>
                      </div>
                      <div className="bg-white/10 rounded-md px-3 py-3">
                        <span data-testid="text-flight-total-return" className="text-xl font-bold text-secondary-foreground">{formatCurrency(totalFlightReturn)}</span>
                      </div>
                    </div>

                    {/* Total Combinado Ida y Vuelta */}
                    <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg p-4 border-2 border-green-300">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-white">Total Ida y Vuelta{passengers > 1 ? ` (${passengers} pax)` : ''}</span>
                        <div className="flex items-center space-x-2">
                          {passengers > 1 && (
                            <span className="text-xs font-bold text-white bg-white/20 px-2 py-1 rounded-full">
                              X{passengers}
                            </span>
                          )}
                          <Calculator className="text-white" size={16} />
                        </div>
                      </div>
                      <div className="bg-white/10 rounded-md px-3 py-3">
                        <span data-testid="text-flight-total-combined" className="text-2xl font-bold text-white">{formatCurrency(totalFlightOutbound + totalFlightReturn)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Clients Section */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <Users className="text-primary mr-3" size={24} />
              <h2 className="text-2xl font-bold text-foreground">Precios por Cliente</h2>
            </div>
            {passengers > 1 && (
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Users size={16} />
                <span>{passengers} Pasajeros</span>
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {clients.map((client, index) => {
              // CLB se anula completamente en ida y vuelta, pero ahora se aplica tanto en SMILES como en LIFE MILES
              const clientCLBTotal = (tripType === 'solo-ida' && includeCancelable) 
                ? client.clbCancelable * passengers 
                : 0;
              const clientTotal = totalFlight + clientCLBTotal;
              
              // Calcular ganancias según el tipo de viaje y programa
              let expectedProfit = 0;
              if (tripType === 'ida-y-vuelta') {
                // Para ida y vuelta: sumar ganancias de ambos vuelos
                expectedProfit = (additionalProfit * passengers) + (additionalProfitReturn * passengers);
              } else if (tripType === 'solo-ida' && includeCancelable) {
                // Para solo ida con CLB (aplica para ambos programas): ganancia CLB + ganancia adicional
                expectedProfit = ((client.clbCancelable - CANCELABLE_COST) * passengers) + (additionalProfit * passengers);
              } else {
                // Para solo ida sin CLB: solo ganancia adicional
                expectedProfit = additionalProfit * passengers;
              }
              
              return (
                <Card key={client.name} className="client-card border border-border">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-center justify-between mb-3 sm:mb-4">
                      <h3 className="text-base sm:text-lg font-bold text-foreground truncate pr-2">{client.name}</h3>
                      <div className="flex items-center space-x-2">
                        {passengers > 1 && (
                          <span className="text-xs font-bold text-accent bg-accent/20 px-2 py-1 rounded-full">
                            X{passengers}
                          </span>
                        )}
                        <div className={`w-7 h-7 sm:w-8 sm:h-8 ${client.color.replace('text-', 'bg-').replace('-400', '-500')} rounded-full flex items-center justify-center flex-shrink-0`}>
                          {client.icon}
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Vuelo Base:</span>
                        <span data-testid={`text-${client.name.toLowerCase().replace(/\s+/g, '-')}-base`} className="text-foreground">{formatCurrency(totalFlight)}</span>
                      </div>
                      {(tripType === 'solo-ida' && includeCancelable) && (
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">CLB Cancelable{passengers > 1 ? ` (x${passengers})` : ''}:</span>
                          <span className={client.color}>+{formatCurrency(clientCLBTotal)}</span>
                        </div>
                      )}
                      <hr className="border-border" />
                      <div className="flex justify-between font-bold">
                        <span className="text-foreground">Total al Cliente:</span>
                        <span data-testid={`text-${client.name.toLowerCase().replace(/\s+/g, '-')}-total`} className={client.color}>{formatCurrency(clientTotal)}</span>
                      </div>
                      <div className="flex justify-between text-sm bg-green-500/10 rounded p-2 mt-2">
                        <span className="text-green-400 font-medium flex items-center">
                          <TrendingUp className="mr-1" size={14} />
                          Ganancia Esperada:
                        </span>
                        <span data-testid={`text-${client.name.toLowerCase().replace(/\s+/g, '-')}-profit`} className="text-green-400 font-bold">{formatCurrency(expectedProfit)}</span>
                      </div>
                      
                      {flightDate && (
                        <div className="mt-3 sm:mt-4 border-t border-border pt-3 sm:pt-4">
                          <div className="flex items-start justify-between mb-2 gap-2">
                            <span className="text-xs sm:text-sm font-medium text-muted-foreground flex items-center flex-shrink-0">
                              <MessageSquare className="mr-1" size={12} />
                              Mensaje:
                            </span>
                            <Button 
                              onClick={() => copyToClipboard(client)}
                              variant="outline"
                              size="sm"
                              className="h-6 px-2 text-xs flex-shrink-0"
                              data-testid={`button-copy-${client.name.toLowerCase().replace(/\s+/g, '-')}`}
                            >
                              <Copy size={10} />
                            </Button>
                          </div>
                          <div className="bg-secondary/50 rounded p-2 text-xs text-foreground overflow-hidden">
                            <div data-testid={`text-message-${client.name.toLowerCase().replace(/\s+/g, '-')}`}>
                              {generatePersonalizedMessage(client).split('\n').map((line, index) => (
                                <div key={index} className="leading-tight break-words">{line}</div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-8 sm:mt-12 bg-card rounded-lg p-4 sm:p-6 border border-border">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 text-center">
            <div className="flex flex-col items-center">
              <Plane className="text-primary mb-2" size={24} />
              <h4 className="font-semibold text-foreground">
                {milesProgram === 'LIFE MILES' ? 'Avianca' : 'GOL'}
              </h4>
              <p className="text-sm text-muted-foreground">
                {milesProgram === 'LIFE MILES' ? 'Canal Millas / Avianca' : 'Programa SMILES'}
              </p>
            </div>
            <div className="flex flex-col items-center">
              <Calculator className="text-accent mb-2" size={24} />
              <h4 className="font-semibold text-foreground">Cálculo Automático</h4>
              <p className="text-sm text-muted-foreground">Tiempo real</p>
            </div>
            <div className="flex flex-col items-center">
              <Users className="text-green-500 mb-2" size={24} />
              <h4 className="font-semibold text-foreground">7 Clientes</h4>
              <p className="text-sm text-muted-foreground">Con cálculo de ganancia</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
