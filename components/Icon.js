import {
  X, Settings, Download, RefreshCw, KeyRound, Check, MessageCircle,
  Wrench, UserSearch, Bot, Sparkles, Search, Palette, Dices, Gamepad2,
  Moon, Cloud, Package, ArrowLeft, ArrowRight, Coffee, FolderOpen,
  HelpCircle, Bell, Lock, XCircle, Save, Hammer, LogOut, Pencil,
  Clipboard, Home, Zap, Megaphone, Smartphone, Hash, BookOpen, Copy, Code2, Square, ChevronDown,
  CheckCircle2, AlertCircle, AlertTriangle, List,
} from 'lucide-react'

const icons = {
  X, Settings, Download, RefreshCw, KeyRound, Check, MessageCircle,
  Wrench, UserSearch, Bot, Sparkles, Search, Palette, Dices, Gamepad2,
  Moon, Cloud, Package, ArrowLeft, ArrowRight, Coffee, FolderOpen,
  HelpCircle, Bell, Lock, XCircle, Save, Hammer, LogOut, Pencil,
  Clipboard, Home, Zap, Megaphone, Smartphone, Hash, BookOpen, Copy, Code2, Square, ChevronDown,
  CheckCircle2, AlertCircle, AlertTriangle, List,
}

export default function Icon({ name, size = 16, color = 'currentColor', style, strokeWidth = 2 }) {
  const Cmp = icons[name] || Package
  return <Cmp size={size} color={color} strokeWidth={strokeWidth} style={{ display: 'inline-block', verticalAlign: 'middle', ...style }} />
}
