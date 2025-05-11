'use client';

import { Icon as ChakraIcon } from '@chakra-ui/react';
import { FaEye, FaEyeSlash, FaDownload, FaPlus, FaMinus } from 'react-icons/fa';
import { RxDashboard } from 'react-icons/rx';
import { IoSettings, IoAnalytics } from 'react-icons/io5';
import { TbWebhook } from 'react-icons/tb';
import { GrConnect } from 'react-icons/gr';
import { LuBotSquare } from 'react-icons/lu';
import { BiLogOut } from 'react-icons/bi';

// Icon map to replace Chakra UI's built-in icon strings
const iconMap = {
  'view': FaEye,
  'view-off': FaEyeSlash,
  'download': FaDownload,
  'plus': FaPlus,
  'minus': FaMinus,
  'dashboard': RxDashboard,
  'settings': IoSettings,
  'analytics': IoAnalytics,
  'webhook': TbWebhook,
  'connect': GrConnect,
  'bot': LuBotSquare,
  'logout': BiLogOut,
  'menu': 'menu'
};

export type IconName = keyof typeof iconMap;

interface IconProps {
  name: IconName;
  [key: string]: any;
}

export function Icon({ name, ...props }: IconProps) {
  const IconComponent = iconMap[name];
  
  if (!IconComponent) {
    console.warn(`Icon "${name}" not found`);
    return null;
  }
  
  if (typeof IconComponent === 'string') {
    return <ChakraIcon>{IconComponent}</ChakraIcon>;
  }
  
  return <ChakraIcon as={IconComponent} {...props} />;
}