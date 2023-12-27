import { MdStorefront } from "react-icons/md";
import { RiShirtFill } from 'react-icons/ri';
import { GiPoloShirt } from 'react-icons/gi';
import { GiTrousers } from 'react-icons/gi'; // Import an icon for "Quan Nam"
import { GiAmpleDress } from 'react-icons/gi'; // Import an icon for "Vay"
import { GiSleevelessJacket } from 'react-icons/gi'; // Import an icon for "Ao Khoat"
import { AiOutlineSmallDash } from 'react-icons/ai'; 

export const categories = [
  {
    label: 'Tất cả',
    icon: MdStorefront,
  },
  {
    label: 'Áo Nam',
    icon: RiShirtFill,
  },
  {
    label: 'Áo Nữ',
    icon: GiPoloShirt,
  },
  {
    label: 'Quần Nam',
    icon: GiTrousers,
  },
  {
    label: 'Váy',
    icon: GiAmpleDress,
  },
  {
    label: 'Áo Khoác',
    icon: GiSleevelessJacket,
  },
  {
    label: 'Phụ kiện',
    icon: AiOutlineSmallDash, // Icon for "Phu kien"
  },
];
