import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { FileText, Plus, MessageSquare, Eye, CheckCircle, AlertCircle, User, DollarSign } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import api from '@/lib/api';

interface RFQ {
  id: number;
  title: string;
  description: string | null;
  status: string;
  created_at: string;
  customer?: {
    user: {
      name: string;
      email: string;
    };
  };
  responses?: RFQResponse[];
}

interface RFQResponse {
  id: number;
  rfq_id: number;
  price: number;
  quantity: number;
  message?: string | null;
  created_at: string;
  supplier?: {
    user: {
      name: string;
      email: string;
    };
  };
}

interface User {
  role: string;
}

const RFQs: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth() as { user: User | null };
  const { toast } = useToast();

  const [rfqs, setRFQs] = useState<RFQ[]>([]);
  const [loading, setLoading] = useState(true);

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isResponseDialogOpen, setIsResponseDialogOpen] = useState(false);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);

  const [selectedRFQ, setSelectedRFQ] = useState<RFQ | null>(null);
  const [detailedRFQ, setDetailedRFQ] = useState<RFQ | null>(null);

  const [newRFQ, setNewRFQ] = useState({ title: '', description: '' });
  const [response, setResponse] = useState({ price: '', quantity: '', message: '' });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const getErrorMessage = (err: any) => {
    if (err.response?.data?.message) return err.response.data.message;
    if (err.response?.data?.errors) {
      const firstKey = Object.keys(err.response.data.errors)[0];
      return err.response.data.errors[firstKey][0];
    }
    return 'Something went wrong';
  };

  const fetchRFQs = async () => {
    setLoading(true);
    try {
      const res = await api.get('/rfqs');
      setRFQs(res.data.data || res.data || []);
    } catch (err: any) {
      toast({
        title: t('error'),
        description: getErrorMessage(err),
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRFQs();
  }, []);

  const fetchRFQDetails = async (id: number) => {
    try {
      const res = await api.get(`/rfqs/${id}`);
      setDetailedRFQ(res.data.data || res.data);
      return true;
    } catch (err: any) {
      toast({
        title: t('error'),
        description: getErrorMessage(err),
        variant: 'destructive',
      });
      return false;
    }
  };

  const handleCreateRFQ = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.post('/rfqs', {
        title: newRFQ.title,
        description: newRFQ.description || null,
      });
      toast({ title: 'RFQ Created', description: 'Your RFQ has been created.' });
      setIsCreateDialogOpen(false);
      setNewRFQ({ title: '', description: '' });
      fetchRFQs();
    } catch (err: any) {
      toast({
        title: t('error'),
        description: getErrorMessage(err),
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRespond = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRFQ) return;
    setIsSubmitting(true);
    try {
      await api.post(`/rfqs/${selectedRFQ.id}/responses`, {
        price: parseFloat(response.price),
        quantity: parseInt(response.quantity, 10),
        message: response.message || null,
      });
      toast({ title: 'Response Sent', description: 'Your response was submitted.' });
      setIsResponseDialogOpen(false);
      setResponse({ price: '', quantity: '', message: '' });
      fetchRFQs();
      if (detailedRFQ && detailedRFQ.id === selectedRFQ.id) fetchRFQDetails(selectedRFQ.id);
    } catch (err: any) {
      toast({
        title: t('error'),
        description: getErrorMessage(err),
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseRFQ = async (rfqId: number) => {
    setIsSubmitting(true);
    try {
      await api.post(`/rfqs/${rfqId}/close`);
      toast({ title: 'RFQ Closed', description: 'The RFQ was closed.' });
      fetchRFQs();
      if (detailedRFQ?.id === rfqId) {
        setDetailedRFQ(null);
        setIsDetailDialogOpen(false);
      }
    } catch (err: any) {
      toast({
        title: t('error'),
        description: getErrorMessage(err),
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusColor = (status: string) =>
    status.toLowerCase() === 'open' ? 'default' : 'secondary';
  const getStatusIcon = (status: string) =>
    status.toLowerCase() === 'open' ? (
      <CheckCircle className="h-4 w-4" />
    ) : (
      <AlertCircle className="h-4 w-4" />
    );

  if (loading) return <p className="text-center py-12">{t('loadingRFQs')}</p>;

  return (
    <div className="space-y-6 container mx-auto px-4 py-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          {user?.role === 'customer' ? 'My RFQs' : 'Available RFQs'}
        </h1>
        {user?.role === 'customer' && (
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" /> Create RFQ
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create RFQ</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreateRFQ} className="space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={newRFQ.title}
                    onChange={(e) =>
                      setNewRFQ({ ...newRFQ, title: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newRFQ.description}
                    onChange={(e) =>
                      setNewRFQ({ ...newRFQ, description: e.target.value })
                    }
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? 'Submitting...' : 'Submit RFQ'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6">
        {rfqs.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3>No RFQs Found</h3>
            <p>
              {user?.role === 'customer'
                ? 'Create your first RFQ'
                : 'No RFQs available'}
            </p>
          </div>
        ) : (
          rfqs.map((rfq) => (
            <Card key={rfq.id} className="shadow-card">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold">{rfq.title}</h3>
                    <p className="text-muted-foreground">
                      {rfq.description || 'No description'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      By: {rfq.customer?.user?.name || 'Unknown'}
                    </p>
                  </div>
                  <Badge
                    variant={getStatusColor(rfq.status) as any}
                    className="flex items-center"
                  >
                    {getStatusIcon(rfq.status)}{' '}
                    <span className="ml-1">{rfq.status}</span>
                  </Badge>
                </div>

                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedRFQ(rfq);
                      fetchRFQDetails(rfq.id).then(
                        (success) => success && setIsDetailDialogOpen(true)
                      );
                    }}
                  >
                    <Eye className="h-4 w-4 mr-2" /> View Details
                  </Button>

                  {user?.role === 'supplier' && rfq.status === 'open' && (
                    <Dialog
                      open={isResponseDialogOpen}
                      onOpenChange={setIsResponseDialogOpen}
                    >
                      <DialogTrigger asChild>
                        <Button size="sm" onClick={() => setSelectedRFQ(rfq)}>
                          <MessageSquare className="h-4 w-4 mr-2" /> Respond
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Respond to {rfq.title}</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleRespond} className="space-y-4">
                          <div>
                            <Label>Price (ETB)</Label>
                            <Input
                              type="number"
                              step="0.01"
                              value={response.price}
                              onChange={(e) =>
                                setResponse({ ...response, price: e.target.value })
                              }
                              required
                            />
                          </div>
                          <div>
                            <Label>Quantity</Label>
                            <Input
                              type="number"
                              value={response.quantity}
                              onChange={(e) =>
                                setResponse({ ...response, quantity: e.target.value })
                              }
                              required
                            />
                          </div>
                          <div>
                            <Label>Message</Label>
                            <Textarea
                              value={response.message}
                              onChange={(e) =>
                                setResponse({ ...response, message: e.target.value })
                              }
                            />
                          </div>
                          <Button
                            type="submit"
                            className="w-full"
                            disabled={isSubmitting}
                          >
                            {isSubmitting ? 'Submitting...' : 'Send Response'}
                          </Button>
                        </form>
                      </DialogContent>
                    </Dialog>
                  )}

                  {user?.role === 'customer' && rfq.status === 'open' && (
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleCloseRFQ(rfq.id)}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Closing...' : 'Close RFQ'}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>RFQ Details</DialogTitle>
          </DialogHeader>
          {detailedRFQ ? (
            <div>
              <p>
                <strong>Title:</strong> {detailedRFQ.title}
              </p>
              <p>
                <strong>Description:</strong> {detailedRFQ.description || 'No description'}
              </p>
              <p>
                <strong>Status:</strong> {detailedRFQ.status}
              </p>
              <p>
                <strong>Customer:</strong> {detailedRFQ.customer?.user?.name} (
                {detailedRFQ.customer?.user?.email})
              </p>
              <h4 className="mt-3 font-semibold">Responses</h4>
              {detailedRFQ.responses?.length ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {detailedRFQ.responses.map((resp) => (
                    <Card key={resp.id} className="shadow-card">
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <User className="h-4 w-4 mr-2" />
                          {resp.supplier?.user?.name || 'Unknown Supplier'}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="flex items-center">
                          <DollarSign className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>
                            <strong>Price:</strong> {resp.price} ETB
                          </span>
                        </div>
                        <div className="flex items-center">
                          <MessageSquare className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>
                            <strong>Quantity:</strong> {resp.quantity}
                          </span>
                        </div>
                        {resp.message && (
                          <div className="flex items-start">
                            <MessageSquare className="h-4 w-4 mr-2 mt-1 text-muted-foreground" />
                            <span>
                              <strong>Message:</strong> {resp.message}
                            </span>
                          </div>
                        )}
                        <Badge variant="secondary" className="mt-2">
                          Submitted
                        </Badge>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <p>No responses yet.</p>
              )}
            </div>
          ) : (
            <p>No details found.</p>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RFQs;