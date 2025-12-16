import { useState, useEffect } from 'react'
import { Diet } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Plus, Trash2, Utensils, AlertCircle } from 'lucide-react'
import { useForm, useFieldArray, Controller } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

interface DietFormProps {
  initialData?: Partial<Diet>
  onSave: (data: Partial<Diet>) => void
  onCancel: () => void
}

const dietSchema = z.object({
  title: z.string().min(1, 'Nome é obrigatório'),
  objective: z.string().min(1, 'Objetivo é obrigatório'),
  type: z.string().min(1, 'Tipo é obrigatório'),
  calories: z.coerce.number().min(0).optional(),
  observations: z.string().optional(),
  isLifetime: z.boolean().default(true),
  expirationDate: z.string().optional().nullable(),
  meals: z.array(
    z.object({
      id: z.string(),
      name: z.string().min(1, 'Nome da refeição obrigatório'),
      time: z.string().optional(),
      items: z.array(
        z.object({
          id: z.string(),
          name: z.string().min(1, 'Nome do alimento obrigatório'),
          quantity: z.string().min(1, 'Qtd obrigatória'),
          unit: z.string().min(1, 'Unidade obrigatória'),
          notes: z.string().optional(),
        }),
      ),
    }),
  ),
})

type DietFormValues = z.infer<typeof dietSchema>

export function DietForm({ initialData, onSave, onCancel }: DietFormProps) {
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
    setValue,
  } = useForm<DietFormValues>({
    resolver: zodResolver(dietSchema),
    defaultValues: {
      title: '',
      objective: '',
      type: '',
      calories: undefined,
      observations: '',
      isLifetime: true,
      expirationDate: '',
      meals: [],
    },
  })

  const isLifetime = watch('isLifetime')

  const {
    fields: mealFields,
    append: appendMeal,
    remove: removeMeal,
  } = useFieldArray({
    control,
    name: 'meals',
  })

  useEffect(() => {
    if (initialData) {
      reset({
        title: initialData.title || '',
        objective: initialData.objective || '',
        type: initialData.type || '',
        calories: initialData.calories,
        observations: initialData.observations || '',
        isLifetime: initialData.isLifetime ?? true,
        expirationDate: initialData.expirationDate
          ? initialData.expirationDate.split('T')[0]
          : '',
        meals: initialData.meals || [],
      })
    }
  }, [initialData, reset])

  const onSubmit = (data: DietFormValues) => {
    onSave({
      ...data,
      expirationDate: data.isLifetime ? null : data.expirationDate,
    } as Partial<Diet>)
  }

  // Helper to get nested field array for items within a meal
  const MealItemsFieldArray = ({
    nestIndex,
    control,
  }: {
    nestIndex: number
    control: any
  }) => {
    const { fields, append, remove } = useFieldArray({
      control,
      name: `meals.${nestIndex}.items`,
    })

    return (
      <div className="space-y-3 mt-2">
        {fields.map((item, k) => (
          <div key={item.id} className="flex gap-2 items-start">
            <div className="grid grid-cols-12 gap-2 flex-1">
              <div className="col-span-4">
                <Input
                  {...control.register(`meals.${nestIndex}.items.${k}.name`)}
                  placeholder="Alimento"
                  className="h-8 text-sm"
                />
              </div>
              <div className="col-span-2">
                <Input
                  {...control.register(
                    `meals.${nestIndex}.items.${k}.quantity`,
                  )}
                  placeholder="Qtd"
                  className="h-8 text-sm"
                />
              </div>
              <div className="col-span-2">
                <Input
                  {...control.register(`meals.${nestIndex}.items.${k}.unit`)}
                  placeholder="Un"
                  className="h-8 text-sm"
                />
              </div>
              <div className="col-span-4">
                <Input
                  {...control.register(`meals.${nestIndex}.items.${k}.notes`)}
                  placeholder="Obs"
                  className="h-8 text-sm"
                />
              </div>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-destructive shrink-0"
              onClick={() => remove(k)}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        ))}
        <Button
          type="button"
          variant="secondary"
          size="sm"
          className="w-full text-xs h-7"
          onClick={() =>
            append({
              id: Math.random().toString(36).substr(2, 9),
              name: '',
              quantity: '',
              unit: '',
              notes: '',
            })
          }
        >
          <Plus className="mr-1 h-3 w-3" /> Adicionar Alimento
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid gap-4 py-4">
        <div className="grid gap-2">
          <Label htmlFor="title">Nome da Dieta *</Label>
          <Controller
            name="title"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                placeholder="Ex: Dieta Low Carb"
                className={errors.title ? 'border-destructive' : ''}
              />
            )}
          />
          {errors.title && (
            <span className="text-xs text-destructive">
              {errors.title.message}
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="objective">Objetivo *</Label>
            <Controller
              name="objective"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Ex: Emagrecimento"
                  className={errors.objective ? 'border-destructive' : ''}
                />
              )}
            />
            {errors.objective && (
              <span className="text-xs text-destructive">
                {errors.objective.message}
              </span>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="type">Tipo *</Label>
            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger
                    className={errors.type ? 'border-destructive' : ''}
                  >
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Balanceada">Balanceada</SelectItem>
                    <SelectItem value="Low Carb">Low Carb</SelectItem>
                    <SelectItem value="Cetogênica">Cetogênica</SelectItem>
                    <SelectItem value="Jejum Intermitente">
                      Jejum Intermitente
                    </SelectItem>
                    <SelectItem value="Hipercalórica">Hipercalórica</SelectItem>
                    <SelectItem value="Outra">Outra</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.type && (
              <span className="text-xs text-destructive">
                {errors.type.message}
              </span>
            )}
          </div>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="calories">Calorias Estimadas (kcal)</Label>
          <Controller
            name="calories"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                type="number"
                placeholder="Ex: 2000"
                value={field.value || ''}
              />
            )}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="observations">Observações Gerais</Label>
          <Controller
            name="observations"
            control={control}
            render={({ field }) => (
              <Textarea
                {...field}
                placeholder="Instruções gerais..."
                className="resize-none"
              />
            )}
          />
        </div>

        <div className="grid gap-4 py-2 border rounded-lg p-4 bg-muted/20">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="isLifetime">Acesso Vitalício</Label>
              <p className="text-xs text-muted-foreground">
                A dieta não terá data de validade
              </p>
            </div>
            <Controller
              name="isLifetime"
              control={control}
              render={({ field }) => (
                <Switch
                  id="isLifetime"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              )}
            />
          </div>

          {!isLifetime && (
            <div className="grid gap-2 animate-fade-in">
              <Label htmlFor="expirationDate">Data de Vencimento</Label>
              <Controller
                name="expirationDate"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="expirationDate"
                    type="date"
                    value={field.value || ''}
                  />
                )}
              />
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between border-b pb-2">
            <Label className="text-base font-semibold flex items-center gap-2">
              <Utensils className="h-4 w-4" /> Refeições
            </Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                appendMeal({
                  id: Math.random().toString(36).substr(2, 9),
                  name: '',
                  items: [],
                })
              }
            >
              <Plus className="mr-2 h-4 w-4" /> Adicionar Refeição
            </Button>
          </div>

          <div className="max-h-[400px] overflow-y-auto pr-2 space-y-4">
            {mealFields.map((field, index) => (
              <div
                key={field.id}
                className="p-4 border rounded-lg bg-card/50 relative group"
              >
                <div className="absolute top-3 right-3">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-muted-foreground hover:text-destructive"
                    onClick={() => removeMeal(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="grid gap-3 mb-3">
                  <div className="grid grid-cols-3 gap-3 pr-8">
                    <div className="col-span-2">
                      <Label className="text-xs text-muted-foreground mb-1 block">
                        Nome da Refeição
                      </Label>
                      <Controller
                        name={`meals.${index}.name`}
                        control={control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            placeholder="Ex: Café da Manhã"
                            className="h-8 font-medium"
                          />
                        )}
                      />
                      {errors.meals?.[index]?.name && (
                        <span className="text-[10px] text-destructive">
                          Obrigatório
                        </span>
                      )}
                    </div>
                    <div className="col-span-1">
                      <Label className="text-xs text-muted-foreground mb-1 block">
                        Horário (Opcional)
                      </Label>
                      <Controller
                        name={`meals.${index}.time`}
                        control={control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            type="time"
                            className="h-8 text-xs"
                          />
                        )}
                      />
                    </div>
                  </div>
                </div>

                <div className="pl-2 border-l-2 border-primary/20">
                  <MealItemsFieldArray nestIndex={index} control={control} />
                </div>
              </div>
            ))}

            {mealFields.length === 0 && (
              <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
                <AlertCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>Nenhuma refeição adicionada.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-2 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">Salvar Dieta</Button>
      </div>
    </form>
  )
}
