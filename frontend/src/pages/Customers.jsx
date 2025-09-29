import React, { useState } from "react";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, UserPlus } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

const STATUS_OPTIONS = [
  "Pending Docs",
  "Pending",
  "Apply",
  "In Progress",
  "Submitted",
  "Completed",
  "Delivered",
];

// 🔹 Mock services with full schema
const mockServices = [
  {
    serviceId: "68d5718b55177e6e04e2538d",
    serviceName: "Passport Application",
    serviceAmount: 3000,
    serviceStatus: "Pending Docs",
    assignedTo: "68d56fdcae443f3a1ff670fb",
    note: "Need birth certificate copy",
  },
  {
    serviceId: "svc2",
    serviceName: "Income Tax Filing",
    serviceAmount: 2500,
    serviceStatus: "Pending Docs",
    assignedTo: "emp123",
    note: "",
  },
  {
    serviceId: "svc3",
    serviceName: "MSME Registration",
    serviceAmount: 1000,
    serviceStatus: "Pending Docs",
    assignedTo: "emp456",
    note: "",
  },
];

// 🔹 Mock customers (aligned with customerSchema)
const initialCustomers = [
  {
    id: "cust1",
    customerId: "CUST001",
    fullName: "John Doe",
    MobileNumber: "9876543210",
    totalAmount: 5500,
    paidAmount: 1000,
    dueAmount: 4500,
    paymentMode: "Cash",
    overStatus: "In Progress",
    note: "VIP customer",
    requiredDocuments: ["PAN Card", "Aadhar Card"],
    deliveryDate: "2025-10-15",
    userId: "user123",
    selectedServices: [
      {
        serviceId: "68d5718b55177e6e04e2538d",
        serviceName: "Passport Application",
        serviceAmount: 3000,
        serviceStatus: "Completed",
        assignedTo: "68d56fdcae443f3a1ff670fb",
        note: "Submitted successfully",
      },
      {
        serviceId: "svc2",
        serviceName: "Income Tax Filing",
        serviceAmount: 2500,
        serviceStatus: "In Progress",
        assignedTo: "emp123",
        note: "Docs pending",
      },
    ],
  },
];

const Customers = () => {
  const [customers, setCustomers] = useState(initialCustomers);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [formData, setFormData] = useState({
    customerId: "",
    fullName: "",
    MobileNumber: "",
    totalAmount: 0,
    paidAmount: 0,
    dueAmount: 0,
    paymentMode: "Cash",
    overStatus: "Pending",
    note: "",
    requiredDocuments: "",
    deliveryDate: "",
    selectedServices: [],
    userId: "user123",
  });

  // 🔹 Handle service toggle
  const handleServiceToggle = (service, checked) => {
    setFormData((prev) => {
      let updated;
      if (checked) {
        updated = [
          ...prev.selectedServices,
          {
            ...service,
            serviceStatus: "Pending Docs",
          },
        ];
      } else {
        updated = prev.selectedServices.filter(
          (s) => s.serviceId !== service.serviceId
        );
      }

      const totalAmount = updated.reduce(
        (sum, svc) => sum + svc.serviceAmount,
        0
      );
      const dueAmount = totalAmount - (parseFloat(prev.paidAmount) || 0);

      return { ...prev, selectedServices: updated, totalAmount, dueAmount };
    });
  };

  // 🔹 Update serviceStatus for selected services
  const handleServiceStatusChange = (serviceId, newStatus) => {
    setFormData((prev) => ({
      ...prev,
      selectedServices: prev.selectedServices.map((svc) =>
        svc.serviceId === serviceId ? { ...svc, serviceStatus: newStatus } : svc
      ),
    }));
  };

  // 🔹 Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();

    const requiredDocs = formData.requiredDocuments
      .split(",")
      .map((doc) => doc.trim())
      .filter(Boolean);

    const customerData = {
      id: editingCustomer ? editingCustomer.id : Date.now().toString(),
      ...formData,
      requiredDocuments: requiredDocs,
    };

    if (editingCustomer) {
      setCustomers((prev) =>
        prev.map((c) => (c.id === editingCustomer.id ? customerData : c))
      );
    } else {
      setCustomers((prev) => [...prev, customerData]);
    }
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      customerId: "",
      fullName: "",
      MobileNumber: "",
      totalAmount: 0,
      paidAmount: 0,
      dueAmount: 0,
      paymentMode: "Cash",
      overStatus: "Pending",
      note: "",
      requiredDocuments: "",
      deliveryDate: "",
      selectedServices: [],
      userId: "user123",
    });
    setEditingCustomer(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (customer) => {
    setEditingCustomer(customer);
    setFormData({
      ...customer,
      requiredDocuments: customer.requiredDocuments.join(", "),
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (customer) => {
    if (window.confirm(`Delete customer "${customer.fullName}"?`)) {
      setCustomers((prev) => prev.filter((c) => c.id !== customer.id));
    }
  };

  // 🔹 Convert overStatus string to variant key
  const getStatusVariant = (status) => {
    return status
      .toLowerCase()
      .replace(/\s+/g, ""); // e.g. "Pending Docs" → "pendingDocs"
  };

  // 🔹 Table Columns
  const columns = [
    { key: "customerId", label: "Customer ID" },
    { key: "fullName", label: "Full Name" },
    { key: "MobileNumber", label: "Mobile" },
    { key: "totalAmount", label: "Total", render: (v) => `₹${v}` },
    { key: "paidAmount", label: "Paid", render: (v) => `₹${v}` },
    {
      key: "dueAmount",
      label: "Due",
      render: (v) => (
        <span className={v > 0 ? "text-red-500" : "text-green-600"}>₹{v}</span>
      ),
    },
    { key: "paymentMode", label: "Payment" },
    {
      key: "overStatus",
      label: "Status",
      render: (val) => (
        <Badge variant={getStatusVariant(val)}>{val}</Badge>
      ),
    },
    { key: "deliveryDate", label: "Delivery" },
  ];


  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-black">Customer Management</h1>
          <p className="text-gray-500">Manage your customers and their orders</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-br from-[#121F3A] via-[#1e386e] to-[#1C4BB2] text-white">
              <Plus className="h-4 w-4 mr-2" />
              Add Customer
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-lg bg-white max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <UserPlus className="h-5 w-5" />
                {editingCustomer ? "Edit Customer" : "Add New Customer"}
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Basic Info */}
              <div className="space-y-2">
                <Label htmlFor="customerId">Customer ID</Label>
                <Input
                  id="customerId"
                  value={formData.customerId}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, customerId: e.target.value }))
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, fullName: e.target.value }))
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="MobileNumber">Mobile Number</Label>
                <Input
                  id="MobileNumber"
                  value={formData.MobileNumber}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, MobileNumber: e.target.value }))
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="deliveryDate">Delivery Date</Label>
                <Input
                  id="deliveryDate"
                  type="date"
                  value={formData.deliveryDate}
                  onChange={(e) =>
                    setFormData((p) => ({
                      ...p,
                      deliveryDate: e.target.value,
                    }))
                  }
                />
              </div>

              {/* Select Services */}
              <div className="space-y-2">
                <Label>Select Services</Label>
                <div className="space-y-3 border-1 border-gray-300 max-h-48 overflow-y-auto p-3 rounded">
                  {mockServices.map((service) => {
                    const selected = formData.selectedServices.find(
                      (s) => s.serviceId === service.serviceId
                    );

                    return (
                      <div key={service.serviceId} className="space-y-2">
                        <div className="flex items-center">
                          <Checkbox
                            id={service.serviceId}
                            checked={!!selected}
                            onCheckedChange={(checked) =>
                              handleServiceToggle(service, checked)
                            }
                          />
                          <Label htmlFor={service.serviceId} className="ml-2">
                            {service.serviceName} – ₹{service.serviceAmount}
                          </Label>
                        </div>

                        {selected && (
                          <div className="ml-6 space-y-2">
                            <Label>Service Status</Label>
                            <Select
                              value={selected.serviceStatus}
                              onValueChange={(val) =>
                                handleServiceStatusChange(service.serviceId, val)
                              }
                            >
                              <SelectTrigger className="w-40 h-8">
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                              <SelectContent className="bg-white">
                                {STATUS_OPTIONS.map((status) => (
                                  <SelectItem className="hover:bg-gray-100 hover:cursor-pointer" key={status} value={status}>
                                    {status}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Payment + Status */}
              <div className="flex gap-4">
                <div className="flex-1 space-y-2">
                  <Label htmlFor="paymentMode">Payment Mode</Label>
                  <Select
                    value={formData.paymentMode}
                    onValueChange={(val) =>
                      setFormData((p) => ({ ...p, paymentMode: val }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select payment mode" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectItem className="hover:bg-gray-100 hover:cursor-pointer" value="Cash">Cash</SelectItem>
                      <SelectItem className="hover:bg-gray-100 hover:cursor-pointer" value="Card">Card</SelectItem>
                      <SelectItem className="hover:bg-gray-100 hover:cursor-pointer" value="Online">Online</SelectItem>
                      <SelectItem className="hover:bg-gray-100 hover:cursor-pointer" value="UPI">UPI</SelectItem>
                      <SelectItem className="hover:bg-gray-100 hover:cursor-pointer" value="Net Banking">Net Banking</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex-1 space-y-2">
                  <Label htmlFor="overStatus">Overall Status</Label>
                  <Select
                    value={formData.overStatus}
                    onValueChange={(val) =>
                      setFormData((p) => ({ ...p, overStatus: val }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      {STATUS_OPTIONS.map((status) => (
                        <SelectItem className="hover:bg-gray-100 hover:cursor-pointer" key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Note */}
              <div className="space-y-2">
                <Label htmlFor="note">Note</Label>
                <Textarea
                  id="note"
                  value={formData.note}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, note: e.target.value }))
                  }
                  placeholder="Add notes"
                />
              </div>

              {/* Amounts (auto-calculated) */}
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-2">
                  <Label>Total Amount</Label>
                  <Input value={formData.totalAmount} readOnly />
                </div>
                <div className="space-y-2">
                  <Label>Paid Amount</Label>
                  <Input
                    type="number"
                    value={formData.paidAmount}
                    onChange={(e) => {
                      const paid = parseFloat(e.target.value) || 0;
                      const due = formData.totalAmount - paid;
                      setFormData((p) => ({
                        ...p,
                        paidAmount: paid,
                        dueAmount: due,
                      }));
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Due Amount</Label>
                  <Input value={formData.dueAmount} readOnly />
                </div>
              </div>

              {/* Required Docs */}
              <div className="space-y-2">
                <Label htmlFor="requiredDocuments">
                  Required Documents (comma-separated)
                </Label>
                <Input
                  id="requiredDocuments"
                  value={formData.requiredDocuments}
                  onChange={(e) =>
                    setFormData((p) => ({
                      ...p,
                      requiredDocuments: e.target.value,
                    }))
                  }
                  placeholder="PAN Card, Aadhaar, etc."
                />
              </div>

              {/* Submit */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="submit"
                  className="flex-1 bg-gradient-to-br from-[#121F3A] via-[#1e386e] to-[#1C4BB2] text-white"
                >
                  {editingCustomer ? "Update Customer" : "Add Customer"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={resetForm}
                  className="border-1 border-gray-300"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Table */}
      <DataTable
        title={`All Customers (${customers.length})`}
        data={customers}
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default Customers;
