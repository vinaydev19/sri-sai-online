import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Eye, Download } from 'lucide-react';

export function DataTable({
    data,
    columns,
    title,
    onEdit,
    onDelete,
    onView,
    onDownload,
    actions = true
}) {
    const renderCellValue = (column, item) => {
        const keyString = String(column.key);
        const value = keyString.includes('.')
            ? keyString.split('.').reduce((obj, key) => obj?.[key], item)
            : item[column.key];

        if (column.render) {
            return column.render(value, item);
        }

        if (Array.isArray(value)) {
            return (
                <div className="flex flex-wrap gap-1">
                    {value.map((val, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                            {val}
                        </Badge>
                    ))}
                </div>
            );
        }

        if (typeof value === 'boolean') {
            return (
                <Badge variant={value ? 'default' : 'secondary'}>
                    {value ? 'Yes' : 'No'}
                </Badge>
            );
        }

        if (typeof value === 'number' && keyString.includes('Amount')) {
            return `₹${value.toLocaleString()}`;
        }

        return value || '-';
    };

    return (
        <Card className="border-gray-200 border-1 shadow-sm">
            {title && (
                <CardHeader>
                    <CardTitle className="text-black">{title}</CardTitle>
                </CardHeader>
            )}
            <CardContent className="p-0">
                <div className="overflow-x-auto">
                    <table className="w-full border-gray-200 border-1">
                        <thead className="bg-[#f9f9fa] border-gray-200 border-1">
                            <tr>
                                {columns.map((column, index) => (
                                    <th
                                        key={index}
                                        className="text-left p-4 font-medium text-gray-600 text-sm"
                                    >
                                        {column.label}
                                    </th>
                                ))}
                                {actions && (
                                    <th className="text-left p-4 font-medium text-gray-600 text-sm">
                                        Actions
                                    </th>
                                )}
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((item) => (
                                <tr
                                    key={item._id}
                                    className="border-gray-200 border-1 hover:bg-[#f9f9fa] transition-colors"
                                >
                                    {columns.map((column, colIndex) => (
                                        <td key={colIndex} className="p-4 text-sm">
                                            {renderCellValue(column, item)}
                                        </td>
                                    ))}
                                    {actions && (
                                        <td className="p-4">
                                            <div className="flex items-center gap-2">
                                                {onView && (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => onView(item)}
                                                        className="h-8 w-8 p-0 hover:bg-gray-600 cursor-pointer"
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                )}
                                                {onDownload && (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => onDownload(item)}
                                                        className="h-8 w-8 p-0 hover:hover:bg-gray-200 cursor-pointer"
                                                    >
                                                        <Download className="h-4 w-4" />
                                                    </Button>
                                                )}
                                                {onEdit && (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => onEdit(item)}
                                                        className="h-8 w-8 p-0 hover:hover:bg-gray-200 cursor-pointer"
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                )}
                                                {onDelete && (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => onDelete(item)}
                                                        className="h-8 w-8 p-0 hover:bg-red-200 hover:text-red-500 cursor-pointer"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                )}
                                            </div>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {data.length === 0 && (
                        <div className="text-center py-12 text-gray-500">
                            No data available
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
