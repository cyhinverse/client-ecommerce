// Shipping rule type
export type ShippingRuleType = "fixed" | "weight_based" | "quantity_based";

// Shipping rule interface
export interface ShippingRule {
  _id?: string;
  name: string;
  type: ShippingRuleType;
  baseFee: number;
  stepUnit?: number;
  stepFee?: number;
}

// Shipping template interface
export interface ShippingTemplate {
  _id: string;
  shop: string;
  name: string;
  isDefault: boolean;
  rules: ShippingRule[];
  createdAt: string;
  updatedAt: string;
}

// Create shipping template payload
export interface CreateShippingTemplatePayload {
  name: string;
  rules: Omit<ShippingRule, "_id">[];
  isDefault?: boolean;
}

// Update shipping template payload
export interface UpdateShippingTemplatePayload {
  name?: string;
  rules?: Omit<ShippingRule, "_id">[];
  isDefault?: boolean;
}

// Shipping state for Redux
export interface ShippingState {
  templates: ShippingTemplate[];
  currentTemplate: ShippingTemplate | null;
  isLoading: boolean;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  error: string | null;
}

// Helper function to calculate shipping fee
export function calculateShippingFee(
  rule: ShippingRule,
  weight?: number,
  quantity?: number
): number {
  switch (rule.type) {
    case "fixed":
      return rule.baseFee;
    case "weight_based":
      if (!weight || !rule.stepUnit || !rule.stepFee) return rule.baseFee;
      const weightSteps = Math.ceil(weight / rule.stepUnit);
      return rule.baseFee + (weightSteps - 1) * rule.stepFee;
    case "quantity_based":
      if (!quantity || !rule.stepUnit || !rule.stepFee) return rule.baseFee;
      const quantitySteps = Math.ceil(quantity / rule.stepUnit);
      return rule.baseFee + (quantitySteps - 1) * rule.stepFee;
    default:
      return rule.baseFee;
  }
}
