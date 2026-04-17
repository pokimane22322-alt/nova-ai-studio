import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Users, Package, FileText, DollarSign } from 'lucide-react';
import AdminOverview from './admin/Overview';
import ClientOverview from './client/Overview';

export default function PortalHome() {
  const { role } = useAuth();
  return role === 'admin' ? <AdminOverview /> : <ClientOverview />;
}
