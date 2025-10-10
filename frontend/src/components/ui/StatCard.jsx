import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

export const StatCard = ({
    title,
    value,
    icon: Icon,
    description,
    trend,
    className = '',
}) => {
    return (
        <Card className={`shadow-md ${className}`}>
            <CardContent className="p-6 flex items-center justify-between">
                <div>
                    <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
                    <p className="text-2xl font-bold text-foreground mt-1">{value}</p>
                    {description && (
                        <p className="text-xs text-muted-foreground mt-1">{description}</p>
                    )}
                    {trend && (
                        <div
                            className={`text-xs mt-2 font-medium ${trend.isPositive ? 'text-green-500' : 'text-red-500'
                                }`}
                        >
                            {trend.isPositive ? '▲' : '▼'} {trend.value}% from last week
                        </div>
                    )}
                </div>

                {Icon && (
                    <div className="p-3 rounded-full bg-muted">
                        <Icon className="w-6 h-6 text-foreground" />
                    </div>
                )}
            </CardContent>
        </Card>
    );
};
