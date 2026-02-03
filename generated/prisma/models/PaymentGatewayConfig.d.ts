import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.ts";
/**
 * Model PaymentGatewayConfig
 *
 */
export type PaymentGatewayConfigModel = runtime.Types.Result.DefaultSelection<Prisma.$PaymentGatewayConfigPayload>;
export type AggregatePaymentGatewayConfig = {
    _count: PaymentGatewayConfigCountAggregateOutputType | null;
    _min: PaymentGatewayConfigMinAggregateOutputType | null;
    _max: PaymentGatewayConfigMaxAggregateOutputType | null;
};
export type PaymentGatewayConfigMinAggregateOutputType = {
    api_key: string | null;
    paymentGatewayId: string | null;
};
export type PaymentGatewayConfigMaxAggregateOutputType = {
    api_key: string | null;
    paymentGatewayId: string | null;
};
export type PaymentGatewayConfigCountAggregateOutputType = {
    api_key: number;
    paymentGatewayId: number;
    _all: number;
};
export type PaymentGatewayConfigMinAggregateInputType = {
    api_key?: true;
    paymentGatewayId?: true;
};
export type PaymentGatewayConfigMaxAggregateInputType = {
    api_key?: true;
    paymentGatewayId?: true;
};
export type PaymentGatewayConfigCountAggregateInputType = {
    api_key?: true;
    paymentGatewayId?: true;
    _all?: true;
};
export type PaymentGatewayConfigAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which PaymentGatewayConfig to aggregate.
     */
    where?: Prisma.PaymentGatewayConfigWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of PaymentGatewayConfigs to fetch.
     */
    orderBy?: Prisma.PaymentGatewayConfigOrderByWithRelationInput | Prisma.PaymentGatewayConfigOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: Prisma.PaymentGatewayConfigWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` PaymentGatewayConfigs from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` PaymentGatewayConfigs.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned PaymentGatewayConfigs
    **/
    _count?: true | PaymentGatewayConfigCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
    **/
    _min?: PaymentGatewayConfigMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
    **/
    _max?: PaymentGatewayConfigMaxAggregateInputType;
};
export type GetPaymentGatewayConfigAggregateType<T extends PaymentGatewayConfigAggregateArgs> = {
    [P in keyof T & keyof AggregatePaymentGatewayConfig]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregatePaymentGatewayConfig[P]> : Prisma.GetScalarType<T[P], AggregatePaymentGatewayConfig[P]>;
};
export type PaymentGatewayConfigGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.PaymentGatewayConfigWhereInput;
    orderBy?: Prisma.PaymentGatewayConfigOrderByWithAggregationInput | Prisma.PaymentGatewayConfigOrderByWithAggregationInput[];
    by: Prisma.PaymentGatewayConfigScalarFieldEnum[] | Prisma.PaymentGatewayConfigScalarFieldEnum;
    having?: Prisma.PaymentGatewayConfigScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: PaymentGatewayConfigCountAggregateInputType | true;
    _min?: PaymentGatewayConfigMinAggregateInputType;
    _max?: PaymentGatewayConfigMaxAggregateInputType;
};
export type PaymentGatewayConfigGroupByOutputType = {
    api_key: string;
    paymentGatewayId: string;
    _count: PaymentGatewayConfigCountAggregateOutputType | null;
    _min: PaymentGatewayConfigMinAggregateOutputType | null;
    _max: PaymentGatewayConfigMaxAggregateOutputType | null;
};
type GetPaymentGatewayConfigGroupByPayload<T extends PaymentGatewayConfigGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<PaymentGatewayConfigGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof PaymentGatewayConfigGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], PaymentGatewayConfigGroupByOutputType[P]> : Prisma.GetScalarType<T[P], PaymentGatewayConfigGroupByOutputType[P]>;
}>>;
export type PaymentGatewayConfigWhereInput = {
    AND?: Prisma.PaymentGatewayConfigWhereInput | Prisma.PaymentGatewayConfigWhereInput[];
    OR?: Prisma.PaymentGatewayConfigWhereInput[];
    NOT?: Prisma.PaymentGatewayConfigWhereInput | Prisma.PaymentGatewayConfigWhereInput[];
    api_key?: Prisma.StringFilter<"PaymentGatewayConfig"> | string;
    paymentGatewayId?: Prisma.StringFilter<"PaymentGatewayConfig"> | string;
    paymentGateway?: Prisma.XOR<Prisma.PaymentGatewayScalarRelationFilter, Prisma.PaymentGatewayWhereInput>;
};
export type PaymentGatewayConfigOrderByWithRelationInput = {
    api_key?: Prisma.SortOrder;
    paymentGatewayId?: Prisma.SortOrder;
    paymentGateway?: Prisma.PaymentGatewayOrderByWithRelationInput;
    _relevance?: Prisma.PaymentGatewayConfigOrderByRelevanceInput;
};
export type PaymentGatewayConfigWhereUniqueInput = Prisma.AtLeast<{
    paymentGatewayId?: string;
    AND?: Prisma.PaymentGatewayConfigWhereInput | Prisma.PaymentGatewayConfigWhereInput[];
    OR?: Prisma.PaymentGatewayConfigWhereInput[];
    NOT?: Prisma.PaymentGatewayConfigWhereInput | Prisma.PaymentGatewayConfigWhereInput[];
    api_key?: Prisma.StringFilter<"PaymentGatewayConfig"> | string;
    paymentGateway?: Prisma.XOR<Prisma.PaymentGatewayScalarRelationFilter, Prisma.PaymentGatewayWhereInput>;
}, "paymentGatewayId">;
export type PaymentGatewayConfigOrderByWithAggregationInput = {
    api_key?: Prisma.SortOrder;
    paymentGatewayId?: Prisma.SortOrder;
    _count?: Prisma.PaymentGatewayConfigCountOrderByAggregateInput;
    _max?: Prisma.PaymentGatewayConfigMaxOrderByAggregateInput;
    _min?: Prisma.PaymentGatewayConfigMinOrderByAggregateInput;
};
export type PaymentGatewayConfigScalarWhereWithAggregatesInput = {
    AND?: Prisma.PaymentGatewayConfigScalarWhereWithAggregatesInput | Prisma.PaymentGatewayConfigScalarWhereWithAggregatesInput[];
    OR?: Prisma.PaymentGatewayConfigScalarWhereWithAggregatesInput[];
    NOT?: Prisma.PaymentGatewayConfigScalarWhereWithAggregatesInput | Prisma.PaymentGatewayConfigScalarWhereWithAggregatesInput[];
    api_key?: Prisma.StringWithAggregatesFilter<"PaymentGatewayConfig"> | string;
    paymentGatewayId?: Prisma.StringWithAggregatesFilter<"PaymentGatewayConfig"> | string;
};
export type PaymentGatewayConfigCreateInput = {
    api_key: string;
    paymentGateway: Prisma.PaymentGatewayCreateNestedOneWithoutConfigInput;
};
export type PaymentGatewayConfigUncheckedCreateInput = {
    api_key: string;
    paymentGatewayId: string;
};
export type PaymentGatewayConfigUpdateInput = {
    api_key?: Prisma.StringFieldUpdateOperationsInput | string;
    paymentGateway?: Prisma.PaymentGatewayUpdateOneRequiredWithoutConfigNestedInput;
};
export type PaymentGatewayConfigUncheckedUpdateInput = {
    api_key?: Prisma.StringFieldUpdateOperationsInput | string;
    paymentGatewayId?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type PaymentGatewayConfigCreateManyInput = {
    api_key: string;
    paymentGatewayId: string;
};
export type PaymentGatewayConfigUpdateManyMutationInput = {
    api_key?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type PaymentGatewayConfigUncheckedUpdateManyInput = {
    api_key?: Prisma.StringFieldUpdateOperationsInput | string;
    paymentGatewayId?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type PaymentGatewayConfigNullableScalarRelationFilter = {
    is?: Prisma.PaymentGatewayConfigWhereInput | null;
    isNot?: Prisma.PaymentGatewayConfigWhereInput | null;
};
export type PaymentGatewayConfigOrderByRelevanceInput = {
    fields: Prisma.PaymentGatewayConfigOrderByRelevanceFieldEnum | Prisma.PaymentGatewayConfigOrderByRelevanceFieldEnum[];
    sort: Prisma.SortOrder;
    search: string;
};
export type PaymentGatewayConfigCountOrderByAggregateInput = {
    api_key?: Prisma.SortOrder;
    paymentGatewayId?: Prisma.SortOrder;
};
export type PaymentGatewayConfigMaxOrderByAggregateInput = {
    api_key?: Prisma.SortOrder;
    paymentGatewayId?: Prisma.SortOrder;
};
export type PaymentGatewayConfigMinOrderByAggregateInput = {
    api_key?: Prisma.SortOrder;
    paymentGatewayId?: Prisma.SortOrder;
};
export type PaymentGatewayConfigCreateNestedOneWithoutPaymentGatewayInput = {
    create?: Prisma.XOR<Prisma.PaymentGatewayConfigCreateWithoutPaymentGatewayInput, Prisma.PaymentGatewayConfigUncheckedCreateWithoutPaymentGatewayInput>;
    connectOrCreate?: Prisma.PaymentGatewayConfigCreateOrConnectWithoutPaymentGatewayInput;
    connect?: Prisma.PaymentGatewayConfigWhereUniqueInput;
};
export type PaymentGatewayConfigUncheckedCreateNestedOneWithoutPaymentGatewayInput = {
    create?: Prisma.XOR<Prisma.PaymentGatewayConfigCreateWithoutPaymentGatewayInput, Prisma.PaymentGatewayConfigUncheckedCreateWithoutPaymentGatewayInput>;
    connectOrCreate?: Prisma.PaymentGatewayConfigCreateOrConnectWithoutPaymentGatewayInput;
    connect?: Prisma.PaymentGatewayConfigWhereUniqueInput;
};
export type PaymentGatewayConfigUpdateOneWithoutPaymentGatewayNestedInput = {
    create?: Prisma.XOR<Prisma.PaymentGatewayConfigCreateWithoutPaymentGatewayInput, Prisma.PaymentGatewayConfigUncheckedCreateWithoutPaymentGatewayInput>;
    connectOrCreate?: Prisma.PaymentGatewayConfigCreateOrConnectWithoutPaymentGatewayInput;
    upsert?: Prisma.PaymentGatewayConfigUpsertWithoutPaymentGatewayInput;
    disconnect?: Prisma.PaymentGatewayConfigWhereInput | boolean;
    delete?: Prisma.PaymentGatewayConfigWhereInput | boolean;
    connect?: Prisma.PaymentGatewayConfigWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.PaymentGatewayConfigUpdateToOneWithWhereWithoutPaymentGatewayInput, Prisma.PaymentGatewayConfigUpdateWithoutPaymentGatewayInput>, Prisma.PaymentGatewayConfigUncheckedUpdateWithoutPaymentGatewayInput>;
};
export type PaymentGatewayConfigUncheckedUpdateOneWithoutPaymentGatewayNestedInput = {
    create?: Prisma.XOR<Prisma.PaymentGatewayConfigCreateWithoutPaymentGatewayInput, Prisma.PaymentGatewayConfigUncheckedCreateWithoutPaymentGatewayInput>;
    connectOrCreate?: Prisma.PaymentGatewayConfigCreateOrConnectWithoutPaymentGatewayInput;
    upsert?: Prisma.PaymentGatewayConfigUpsertWithoutPaymentGatewayInput;
    disconnect?: Prisma.PaymentGatewayConfigWhereInput | boolean;
    delete?: Prisma.PaymentGatewayConfigWhereInput | boolean;
    connect?: Prisma.PaymentGatewayConfigWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.PaymentGatewayConfigUpdateToOneWithWhereWithoutPaymentGatewayInput, Prisma.PaymentGatewayConfigUpdateWithoutPaymentGatewayInput>, Prisma.PaymentGatewayConfigUncheckedUpdateWithoutPaymentGatewayInput>;
};
export type PaymentGatewayConfigCreateWithoutPaymentGatewayInput = {
    api_key: string;
};
export type PaymentGatewayConfigUncheckedCreateWithoutPaymentGatewayInput = {
    api_key: string;
};
export type PaymentGatewayConfigCreateOrConnectWithoutPaymentGatewayInput = {
    where: Prisma.PaymentGatewayConfigWhereUniqueInput;
    create: Prisma.XOR<Prisma.PaymentGatewayConfigCreateWithoutPaymentGatewayInput, Prisma.PaymentGatewayConfigUncheckedCreateWithoutPaymentGatewayInput>;
};
export type PaymentGatewayConfigUpsertWithoutPaymentGatewayInput = {
    update: Prisma.XOR<Prisma.PaymentGatewayConfigUpdateWithoutPaymentGatewayInput, Prisma.PaymentGatewayConfigUncheckedUpdateWithoutPaymentGatewayInput>;
    create: Prisma.XOR<Prisma.PaymentGatewayConfigCreateWithoutPaymentGatewayInput, Prisma.PaymentGatewayConfigUncheckedCreateWithoutPaymentGatewayInput>;
    where?: Prisma.PaymentGatewayConfigWhereInput;
};
export type PaymentGatewayConfigUpdateToOneWithWhereWithoutPaymentGatewayInput = {
    where?: Prisma.PaymentGatewayConfigWhereInput;
    data: Prisma.XOR<Prisma.PaymentGatewayConfigUpdateWithoutPaymentGatewayInput, Prisma.PaymentGatewayConfigUncheckedUpdateWithoutPaymentGatewayInput>;
};
export type PaymentGatewayConfigUpdateWithoutPaymentGatewayInput = {
    api_key?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type PaymentGatewayConfigUncheckedUpdateWithoutPaymentGatewayInput = {
    api_key?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type PaymentGatewayConfigSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    api_key?: boolean;
    paymentGatewayId?: boolean;
    paymentGateway?: boolean | Prisma.PaymentGatewayDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["paymentGatewayConfig"]>;
export type PaymentGatewayConfigSelectScalar = {
    api_key?: boolean;
    paymentGatewayId?: boolean;
};
export type PaymentGatewayConfigOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"api_key" | "paymentGatewayId", ExtArgs["result"]["paymentGatewayConfig"]>;
export type PaymentGatewayConfigInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    paymentGateway?: boolean | Prisma.PaymentGatewayDefaultArgs<ExtArgs>;
};
export type $PaymentGatewayConfigPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "PaymentGatewayConfig";
    objects: {
        paymentGateway: Prisma.$PaymentGatewayPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        api_key: string;
        paymentGatewayId: string;
    }, ExtArgs["result"]["paymentGatewayConfig"]>;
    composites: {};
};
export type PaymentGatewayConfigGetPayload<S extends boolean | null | undefined | PaymentGatewayConfigDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$PaymentGatewayConfigPayload, S>;
export type PaymentGatewayConfigCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<PaymentGatewayConfigFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: PaymentGatewayConfigCountAggregateInputType | true;
};
export interface PaymentGatewayConfigDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['PaymentGatewayConfig'];
        meta: {
            name: 'PaymentGatewayConfig';
        };
    };
    /**
     * Find zero or one PaymentGatewayConfig that matches the filter.
     * @param {PaymentGatewayConfigFindUniqueArgs} args - Arguments to find a PaymentGatewayConfig
     * @example
     * // Get one PaymentGatewayConfig
     * const paymentGatewayConfig = await prisma.paymentGatewayConfig.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PaymentGatewayConfigFindUniqueArgs>(args: Prisma.SelectSubset<T, PaymentGatewayConfigFindUniqueArgs<ExtArgs>>): Prisma.Prisma__PaymentGatewayConfigClient<runtime.Types.Result.GetResult<Prisma.$PaymentGatewayConfigPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find one PaymentGatewayConfig that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PaymentGatewayConfigFindUniqueOrThrowArgs} args - Arguments to find a PaymentGatewayConfig
     * @example
     * // Get one PaymentGatewayConfig
     * const paymentGatewayConfig = await prisma.paymentGatewayConfig.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PaymentGatewayConfigFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, PaymentGatewayConfigFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__PaymentGatewayConfigClient<runtime.Types.Result.GetResult<Prisma.$PaymentGatewayConfigPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first PaymentGatewayConfig that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentGatewayConfigFindFirstArgs} args - Arguments to find a PaymentGatewayConfig
     * @example
     * // Get one PaymentGatewayConfig
     * const paymentGatewayConfig = await prisma.paymentGatewayConfig.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PaymentGatewayConfigFindFirstArgs>(args?: Prisma.SelectSubset<T, PaymentGatewayConfigFindFirstArgs<ExtArgs>>): Prisma.Prisma__PaymentGatewayConfigClient<runtime.Types.Result.GetResult<Prisma.$PaymentGatewayConfigPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first PaymentGatewayConfig that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentGatewayConfigFindFirstOrThrowArgs} args - Arguments to find a PaymentGatewayConfig
     * @example
     * // Get one PaymentGatewayConfig
     * const paymentGatewayConfig = await prisma.paymentGatewayConfig.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PaymentGatewayConfigFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, PaymentGatewayConfigFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__PaymentGatewayConfigClient<runtime.Types.Result.GetResult<Prisma.$PaymentGatewayConfigPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find zero or more PaymentGatewayConfigs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentGatewayConfigFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all PaymentGatewayConfigs
     * const paymentGatewayConfigs = await prisma.paymentGatewayConfig.findMany()
     *
     * // Get first 10 PaymentGatewayConfigs
     * const paymentGatewayConfigs = await prisma.paymentGatewayConfig.findMany({ take: 10 })
     *
     * // Only select the `api_key`
     * const paymentGatewayConfigWithApi_keyOnly = await prisma.paymentGatewayConfig.findMany({ select: { api_key: true } })
     *
     */
    findMany<T extends PaymentGatewayConfigFindManyArgs>(args?: Prisma.SelectSubset<T, PaymentGatewayConfigFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$PaymentGatewayConfigPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    /**
     * Create a PaymentGatewayConfig.
     * @param {PaymentGatewayConfigCreateArgs} args - Arguments to create a PaymentGatewayConfig.
     * @example
     * // Create one PaymentGatewayConfig
     * const PaymentGatewayConfig = await prisma.paymentGatewayConfig.create({
     *   data: {
     *     // ... data to create a PaymentGatewayConfig
     *   }
     * })
     *
     */
    create<T extends PaymentGatewayConfigCreateArgs>(args: Prisma.SelectSubset<T, PaymentGatewayConfigCreateArgs<ExtArgs>>): Prisma.Prisma__PaymentGatewayConfigClient<runtime.Types.Result.GetResult<Prisma.$PaymentGatewayConfigPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Create many PaymentGatewayConfigs.
     * @param {PaymentGatewayConfigCreateManyArgs} args - Arguments to create many PaymentGatewayConfigs.
     * @example
     * // Create many PaymentGatewayConfigs
     * const paymentGatewayConfig = await prisma.paymentGatewayConfig.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends PaymentGatewayConfigCreateManyArgs>(args?: Prisma.SelectSubset<T, PaymentGatewayConfigCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Delete a PaymentGatewayConfig.
     * @param {PaymentGatewayConfigDeleteArgs} args - Arguments to delete one PaymentGatewayConfig.
     * @example
     * // Delete one PaymentGatewayConfig
     * const PaymentGatewayConfig = await prisma.paymentGatewayConfig.delete({
     *   where: {
     *     // ... filter to delete one PaymentGatewayConfig
     *   }
     * })
     *
     */
    delete<T extends PaymentGatewayConfigDeleteArgs>(args: Prisma.SelectSubset<T, PaymentGatewayConfigDeleteArgs<ExtArgs>>): Prisma.Prisma__PaymentGatewayConfigClient<runtime.Types.Result.GetResult<Prisma.$PaymentGatewayConfigPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Update one PaymentGatewayConfig.
     * @param {PaymentGatewayConfigUpdateArgs} args - Arguments to update one PaymentGatewayConfig.
     * @example
     * // Update one PaymentGatewayConfig
     * const paymentGatewayConfig = await prisma.paymentGatewayConfig.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends PaymentGatewayConfigUpdateArgs>(args: Prisma.SelectSubset<T, PaymentGatewayConfigUpdateArgs<ExtArgs>>): Prisma.Prisma__PaymentGatewayConfigClient<runtime.Types.Result.GetResult<Prisma.$PaymentGatewayConfigPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Delete zero or more PaymentGatewayConfigs.
     * @param {PaymentGatewayConfigDeleteManyArgs} args - Arguments to filter PaymentGatewayConfigs to delete.
     * @example
     * // Delete a few PaymentGatewayConfigs
     * const { count } = await prisma.paymentGatewayConfig.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends PaymentGatewayConfigDeleteManyArgs>(args?: Prisma.SelectSubset<T, PaymentGatewayConfigDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more PaymentGatewayConfigs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentGatewayConfigUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many PaymentGatewayConfigs
     * const paymentGatewayConfig = await prisma.paymentGatewayConfig.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends PaymentGatewayConfigUpdateManyArgs>(args: Prisma.SelectSubset<T, PaymentGatewayConfigUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Create or update one PaymentGatewayConfig.
     * @param {PaymentGatewayConfigUpsertArgs} args - Arguments to update or create a PaymentGatewayConfig.
     * @example
     * // Update or create a PaymentGatewayConfig
     * const paymentGatewayConfig = await prisma.paymentGatewayConfig.upsert({
     *   create: {
     *     // ... data to create a PaymentGatewayConfig
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the PaymentGatewayConfig we want to update
     *   }
     * })
     */
    upsert<T extends PaymentGatewayConfigUpsertArgs>(args: Prisma.SelectSubset<T, PaymentGatewayConfigUpsertArgs<ExtArgs>>): Prisma.Prisma__PaymentGatewayConfigClient<runtime.Types.Result.GetResult<Prisma.$PaymentGatewayConfigPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Count the number of PaymentGatewayConfigs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentGatewayConfigCountArgs} args - Arguments to filter PaymentGatewayConfigs to count.
     * @example
     * // Count the number of PaymentGatewayConfigs
     * const count = await prisma.paymentGatewayConfig.count({
     *   where: {
     *     // ... the filter for the PaymentGatewayConfigs we want to count
     *   }
     * })
    **/
    count<T extends PaymentGatewayConfigCountArgs>(args?: Prisma.Subset<T, PaymentGatewayConfigCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], PaymentGatewayConfigCountAggregateOutputType> : number>;
    /**
     * Allows you to perform aggregations operations on a PaymentGatewayConfig.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentGatewayConfigAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PaymentGatewayConfigAggregateArgs>(args: Prisma.Subset<T, PaymentGatewayConfigAggregateArgs>): Prisma.PrismaPromise<GetPaymentGatewayConfigAggregateType<T>>;
    /**
     * Group by PaymentGatewayConfig.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentGatewayConfigGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
    **/
    groupBy<T extends PaymentGatewayConfigGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: PaymentGatewayConfigGroupByArgs['orderBy'];
    } : {
        orderBy?: PaymentGatewayConfigGroupByArgs['orderBy'];
    }, OrderFields extends Prisma.ExcludeUnderscoreKeys<Prisma.Keys<Prisma.MaybeTupleToUnion<T['orderBy']>>>, ByFields extends Prisma.MaybeTupleToUnion<T['by']>, ByValid extends Prisma.Has<ByFields, OrderFields>, HavingFields extends Prisma.GetHavingFields<T['having']>, HavingValid extends Prisma.Has<ByFields, HavingFields>, ByEmpty extends T['by'] extends never[] ? Prisma.True : Prisma.False, InputErrors extends ByEmpty extends Prisma.True ? `Error: "by" must not be empty.` : HavingValid extends Prisma.False ? {
        [P in HavingFields]: P extends ByFields ? never : P extends string ? `Error: Field "${P}" used in "having" needs to be provided in "by".` : [
            Error,
            'Field ',
            P,
            ` in "having" needs to be provided in "by"`
        ];
    }[HavingFields] : 'take' extends Prisma.Keys<T> ? 'orderBy' extends Prisma.Keys<T> ? ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields] : 'Error: If you provide "take", you also need to provide "orderBy"' : 'skip' extends Prisma.Keys<T> ? 'orderBy' extends Prisma.Keys<T> ? ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields] : 'Error: If you provide "skip", you also need to provide "orderBy"' : ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, PaymentGatewayConfigGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPaymentGatewayConfigGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the PaymentGatewayConfig model
     */
    readonly fields: PaymentGatewayConfigFieldRefs;
}
/**
 * The delegate class that acts as a "Promise-like" for PaymentGatewayConfig.
 * Why is this prefixed with `Prisma__`?
 * Because we want to prevent naming conflicts as mentioned in
 * https://github.com/prisma/prisma-client-js/issues/707
 */
export interface Prisma__PaymentGatewayConfigClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    paymentGateway<T extends Prisma.PaymentGatewayDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.PaymentGatewayDefaultArgs<ExtArgs>>): Prisma.Prisma__PaymentGatewayClient<runtime.Types.Result.GetResult<Prisma.$PaymentGatewayPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
/**
 * Fields of the PaymentGatewayConfig model
 */
export interface PaymentGatewayConfigFieldRefs {
    readonly api_key: Prisma.FieldRef<"PaymentGatewayConfig", 'String'>;
    readonly paymentGatewayId: Prisma.FieldRef<"PaymentGatewayConfig", 'String'>;
}
/**
 * PaymentGatewayConfig findUnique
 */
export type PaymentGatewayConfigFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PaymentGatewayConfig
     */
    select?: Prisma.PaymentGatewayConfigSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the PaymentGatewayConfig
     */
    omit?: Prisma.PaymentGatewayConfigOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.PaymentGatewayConfigInclude<ExtArgs> | null;
    /**
     * Filter, which PaymentGatewayConfig to fetch.
     */
    where: Prisma.PaymentGatewayConfigWhereUniqueInput;
};
/**
 * PaymentGatewayConfig findUniqueOrThrow
 */
export type PaymentGatewayConfigFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PaymentGatewayConfig
     */
    select?: Prisma.PaymentGatewayConfigSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the PaymentGatewayConfig
     */
    omit?: Prisma.PaymentGatewayConfigOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.PaymentGatewayConfigInclude<ExtArgs> | null;
    /**
     * Filter, which PaymentGatewayConfig to fetch.
     */
    where: Prisma.PaymentGatewayConfigWhereUniqueInput;
};
/**
 * PaymentGatewayConfig findFirst
 */
export type PaymentGatewayConfigFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PaymentGatewayConfig
     */
    select?: Prisma.PaymentGatewayConfigSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the PaymentGatewayConfig
     */
    omit?: Prisma.PaymentGatewayConfigOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.PaymentGatewayConfigInclude<ExtArgs> | null;
    /**
     * Filter, which PaymentGatewayConfig to fetch.
     */
    where?: Prisma.PaymentGatewayConfigWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of PaymentGatewayConfigs to fetch.
     */
    orderBy?: Prisma.PaymentGatewayConfigOrderByWithRelationInput | Prisma.PaymentGatewayConfigOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for PaymentGatewayConfigs.
     */
    cursor?: Prisma.PaymentGatewayConfigWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` PaymentGatewayConfigs from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` PaymentGatewayConfigs.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of PaymentGatewayConfigs.
     */
    distinct?: Prisma.PaymentGatewayConfigScalarFieldEnum | Prisma.PaymentGatewayConfigScalarFieldEnum[];
};
/**
 * PaymentGatewayConfig findFirstOrThrow
 */
export type PaymentGatewayConfigFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PaymentGatewayConfig
     */
    select?: Prisma.PaymentGatewayConfigSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the PaymentGatewayConfig
     */
    omit?: Prisma.PaymentGatewayConfigOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.PaymentGatewayConfigInclude<ExtArgs> | null;
    /**
     * Filter, which PaymentGatewayConfig to fetch.
     */
    where?: Prisma.PaymentGatewayConfigWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of PaymentGatewayConfigs to fetch.
     */
    orderBy?: Prisma.PaymentGatewayConfigOrderByWithRelationInput | Prisma.PaymentGatewayConfigOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for PaymentGatewayConfigs.
     */
    cursor?: Prisma.PaymentGatewayConfigWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` PaymentGatewayConfigs from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` PaymentGatewayConfigs.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of PaymentGatewayConfigs.
     */
    distinct?: Prisma.PaymentGatewayConfigScalarFieldEnum | Prisma.PaymentGatewayConfigScalarFieldEnum[];
};
/**
 * PaymentGatewayConfig findMany
 */
export type PaymentGatewayConfigFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PaymentGatewayConfig
     */
    select?: Prisma.PaymentGatewayConfigSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the PaymentGatewayConfig
     */
    omit?: Prisma.PaymentGatewayConfigOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.PaymentGatewayConfigInclude<ExtArgs> | null;
    /**
     * Filter, which PaymentGatewayConfigs to fetch.
     */
    where?: Prisma.PaymentGatewayConfigWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of PaymentGatewayConfigs to fetch.
     */
    orderBy?: Prisma.PaymentGatewayConfigOrderByWithRelationInput | Prisma.PaymentGatewayConfigOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing PaymentGatewayConfigs.
     */
    cursor?: Prisma.PaymentGatewayConfigWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` PaymentGatewayConfigs from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` PaymentGatewayConfigs.
     */
    skip?: number;
    distinct?: Prisma.PaymentGatewayConfigScalarFieldEnum | Prisma.PaymentGatewayConfigScalarFieldEnum[];
};
/**
 * PaymentGatewayConfig create
 */
export type PaymentGatewayConfigCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PaymentGatewayConfig
     */
    select?: Prisma.PaymentGatewayConfigSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the PaymentGatewayConfig
     */
    omit?: Prisma.PaymentGatewayConfigOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.PaymentGatewayConfigInclude<ExtArgs> | null;
    /**
     * The data needed to create a PaymentGatewayConfig.
     */
    data: Prisma.XOR<Prisma.PaymentGatewayConfigCreateInput, Prisma.PaymentGatewayConfigUncheckedCreateInput>;
};
/**
 * PaymentGatewayConfig createMany
 */
export type PaymentGatewayConfigCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to create many PaymentGatewayConfigs.
     */
    data: Prisma.PaymentGatewayConfigCreateManyInput | Prisma.PaymentGatewayConfigCreateManyInput[];
    skipDuplicates?: boolean;
};
/**
 * PaymentGatewayConfig update
 */
export type PaymentGatewayConfigUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PaymentGatewayConfig
     */
    select?: Prisma.PaymentGatewayConfigSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the PaymentGatewayConfig
     */
    omit?: Prisma.PaymentGatewayConfigOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.PaymentGatewayConfigInclude<ExtArgs> | null;
    /**
     * The data needed to update a PaymentGatewayConfig.
     */
    data: Prisma.XOR<Prisma.PaymentGatewayConfigUpdateInput, Prisma.PaymentGatewayConfigUncheckedUpdateInput>;
    /**
     * Choose, which PaymentGatewayConfig to update.
     */
    where: Prisma.PaymentGatewayConfigWhereUniqueInput;
};
/**
 * PaymentGatewayConfig updateMany
 */
export type PaymentGatewayConfigUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to update PaymentGatewayConfigs.
     */
    data: Prisma.XOR<Prisma.PaymentGatewayConfigUpdateManyMutationInput, Prisma.PaymentGatewayConfigUncheckedUpdateManyInput>;
    /**
     * Filter which PaymentGatewayConfigs to update
     */
    where?: Prisma.PaymentGatewayConfigWhereInput;
    /**
     * Limit how many PaymentGatewayConfigs to update.
     */
    limit?: number;
};
/**
 * PaymentGatewayConfig upsert
 */
export type PaymentGatewayConfigUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PaymentGatewayConfig
     */
    select?: Prisma.PaymentGatewayConfigSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the PaymentGatewayConfig
     */
    omit?: Prisma.PaymentGatewayConfigOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.PaymentGatewayConfigInclude<ExtArgs> | null;
    /**
     * The filter to search for the PaymentGatewayConfig to update in case it exists.
     */
    where: Prisma.PaymentGatewayConfigWhereUniqueInput;
    /**
     * In case the PaymentGatewayConfig found by the `where` argument doesn't exist, create a new PaymentGatewayConfig with this data.
     */
    create: Prisma.XOR<Prisma.PaymentGatewayConfigCreateInput, Prisma.PaymentGatewayConfigUncheckedCreateInput>;
    /**
     * In case the PaymentGatewayConfig was found with the provided `where` argument, update it with this data.
     */
    update: Prisma.XOR<Prisma.PaymentGatewayConfigUpdateInput, Prisma.PaymentGatewayConfigUncheckedUpdateInput>;
};
/**
 * PaymentGatewayConfig delete
 */
export type PaymentGatewayConfigDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PaymentGatewayConfig
     */
    select?: Prisma.PaymentGatewayConfigSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the PaymentGatewayConfig
     */
    omit?: Prisma.PaymentGatewayConfigOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.PaymentGatewayConfigInclude<ExtArgs> | null;
    /**
     * Filter which PaymentGatewayConfig to delete.
     */
    where: Prisma.PaymentGatewayConfigWhereUniqueInput;
};
/**
 * PaymentGatewayConfig deleteMany
 */
export type PaymentGatewayConfigDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which PaymentGatewayConfigs to delete
     */
    where?: Prisma.PaymentGatewayConfigWhereInput;
    /**
     * Limit how many PaymentGatewayConfigs to delete.
     */
    limit?: number;
};
/**
 * PaymentGatewayConfig without action
 */
export type PaymentGatewayConfigDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PaymentGatewayConfig
     */
    select?: Prisma.PaymentGatewayConfigSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the PaymentGatewayConfig
     */
    omit?: Prisma.PaymentGatewayConfigOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.PaymentGatewayConfigInclude<ExtArgs> | null;
};
export {};
