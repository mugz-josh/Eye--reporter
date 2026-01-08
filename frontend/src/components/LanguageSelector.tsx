import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

const LanguageSelector: React.FC = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (language: string) => {
    i18n.changeLanguage(language);
    localStorage.setItem('language', language);
  };

  return (
    <Select onValueChange={changeLanguage} defaultValue={i18n.language}>
      <SelectTrigger className="w-[140px]">
        <Globe className="w-4 h-4 mr-2" />
        <SelectValue placeholder="Language" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="en">English</SelectItem>
        <SelectItem value="fr">Français</SelectItem>
        <SelectItem value="sw">Kiswahili</SelectItem>
        <SelectItem value="lg">Luganda</SelectItem>
        <SelectItem value="rn">Runyankole</SelectItem>
        <SelectItem value="xog">Lusoga</SelectItem>
        <SelectItem value="ar">العربية</SelectItem>
        <SelectItem value="pt">Português</SelectItem>
        <SelectItem value="zu">isiZulu</SelectItem>
        <SelectItem value="yo">Yorùbá</SelectItem>
        <SelectItem value="am">አማርኛ</SelectItem>
        <SelectItem value="ha">Hausa</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default LanguageSelector;
