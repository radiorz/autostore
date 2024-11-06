/**
 *  创建表单字段
 * 
 *  当默认的表单字段不能满足要求，可以使用Field组件创建自定义的表单字段
 * 
 * 
 * 
 * const { state } = useStore() 
 * const { Form,Field } = useForm()
 * 
 * 
 * <Form>
 *      <Field<typeof state.order.price>        // 泛型参数指定字段的类型
 *          name="order.price"                  // 指定要绑定到状态的哪里
 *          validate={(value)=>boolean}         // 这是一个计算属性，可以是同步或异步的
 *          validate={async (value)=>boolean}   // 这是一个计算属性，可以是同步或异步的
 *          validate={computed(....)}           // 创建一个计算属性
 *          help="请输入价格"                    // 提示信息
 *          visible={true}                      // 是否可见
 *          visible={computed(....)}            // 创建一个计算属性
 *          render={({visible,name,value,loading,error,onChange,validate,dirty,help})=>{ 
 *              return <input name={name} onChange={onChange}/>
 *          })
 *      >
 * 
 * </Form>
 * validate是一个计算属性，当value变化时会自动执行，返回值为true表示校验通过，false表示校验失败
 * 计算属性的数据会传递给render 
 *          render={({name,value,timeout,loading,retry,validate,....})=>{ 
 *              return <input name={name} onChange={onChange}/>
 *          })
 * 
 * 
 * 
 * 
 * @example
 * 
 * 
 * <Form>
 *      <Field
 *          name={(state)=>state.price+state.count}
 * 
 *          render={({value,onChange,loading,timeout,.....})=>{
 *               当price或count变化时，会自动更新
 *              return <span onClick={
 *                  (e)=>{
 *                      onChange(e,state=>{
 *                          
 *                      }) // 更新状态
 *                  }
 *              }>{price} + {count}</span>
 *          })
 *      >
 * 
 * </Form>
 * 
 */

import { computed, ComputedObject,  Dict,  ObserverBuilder, PATH_DELIMITER, PickComputedResult, PickComputedResult2, setVal, Watcher } from "autostore"
import React, {  useCallback, useEffect, useRef, useState } from "react"
import { ReactAutoStore } from "../store"
import { AutoFormContext } from "./Form"
import { SignalComponentRenderArgs } from "../types"
import { pickValue } from "./utils/pickValue"
import { getInputValueFromEvent } from "../utils"


export interface AutoFieldRenderProps<State extends Dict,Value, 
    Validate extends FiledComputedBooleanProp<State> =  FiledComputedBooleanProp<State>,    
    Required extends FiledComputedBooleanProp<State> =  FiledComputedBooleanProp<State>,
    Visible extends FiledComputedBooleanProp<State> =  FiledComputedBooleanProp<State>,
    Enable extends FiledComputedBooleanProp<State> =  FiledComputedBooleanProp<State>, 
    Label extends FiledComputedStringProp<State> =  FiledComputedStringProp<State>,   
    Help extends FiledComputedStringProp<State> =  FiledComputedStringProp<State>,
    Readonly extends FiledComputedBooleanProp<State> =  FiledComputedBooleanProp<State>,
    Select extends FiledComputedArrayProp<State> =  FiledComputedArrayProp<State>
> extends SignalComponentRenderArgs<Value> {
    name    : string 
    validate: PickComputedResult<Validate> 
    required: PickComputedResult<Required> 
    visible : PickComputedResult<Visible> 
    readonly: PickComputedResult<Readonly> 
    enable  : PickComputedResult<Enable> 
    select  : PickComputedResult<Select> 
    help    : PickComputedResult<Help> 
    label   : PickComputedResult<Label>
    onChange: (e:React.ChangeEvent<HTMLInputElement>)=>void
}  


export type AutoFieldComputedProps<State extends Dict> = {
    label   : string | ObserverBuilder<string,State>
    required: boolean | ObserverBuilder<boolean,State>
    validate: boolean | ObserverBuilder<boolean,State>
    visible : boolean | ObserverBuilder<boolean,State>
    readonly: boolean | ObserverBuilder<boolean,State>
    enable  : boolean | ObserverBuilder<boolean,State>
    select  : boolean | ObserverBuilder<any[],State>
    help    : string  | ObserverBuilder<string,State>
}

 
export type FiledComputedBooleanProp<State extends Dict,Scope = State> = boolean| ObserverBuilder<boolean,Scope>  
export type FiledComputedStringProp<State extends Dict,Scope  = State> = string | ObserverBuilder<string,Scope>  
export type FiledComputedNumberProp<State extends Dict,Scope  = State> = number | ObserverBuilder<number,Scope>  
export type FiledComputedArrayProp<State extends Dict,Scope   = State> = Array<any> | ObserverBuilder<Array<any>,Scope>  



export interface AutoFieldProps<State extends Dict,
    Value, 
    Validate extends FiledComputedBooleanProp<State> = FiledComputedBooleanProp<State>,    
    Required extends FiledComputedBooleanProp<State> = FiledComputedBooleanProp<State>,
    Visible extends FiledComputedBooleanProp<State>  = FiledComputedBooleanProp<State>,
    Enable extends FiledComputedBooleanProp<State>   = FiledComputedBooleanProp<State>, 
    Label extends FiledComputedStringProp<State>     = FiledComputedStringProp<State>,   
    Help extends FiledComputedStringProp<State>      = FiledComputedStringProp<State>,
    Readonly extends FiledComputedBooleanProp<State> = FiledComputedBooleanProp<State>,
    Select extends FiledComputedArrayProp<State>     = FiledComputedArrayProp<State>
> {
    name      : string  
    validate? : Validate 
    required? : Required
    visible?  : Visible
    readonly? : Readonly
    enable?   : Enable
    select?   : Select
    help?     : Help
    label?    : Label
    render    : (props:AutoFieldRenderProps<State,Value,Validate,Required,Visible,Enable,Label,Help,Readonly,Select>)=>React.ReactNode
}  

export type AutoField<State extends Dict> = <
    Value,
    Validate extends FiledComputedBooleanProp<State> = FiledComputedBooleanProp<State>,    
    Required extends FiledComputedBooleanProp<State> = FiledComputedBooleanProp<State>,
    Visible extends FiledComputedBooleanProp<State>  = FiledComputedBooleanProp<State>,
    Enable extends FiledComputedBooleanProp<State>   = FiledComputedBooleanProp<State>, 
    Label extends FiledComputedStringProp<State>     = FiledComputedStringProp<State>,   
    Help extends FiledComputedStringProp<State>      = FiledComputedStringProp<State>,
    Readonly extends FiledComputedBooleanProp<State> = FiledComputedBooleanProp<State>,
    Select extends FiledComputedArrayProp<State>     = FiledComputedArrayProp<State>
>(
    props:AutoFieldProps<State,Value,Validate,Required,Visible,Enable,Label,Help,Readonly,Select>
)=>React.ReactNode
 


function buildFieldRenderProps(props:any){
    return Object.assign({
        value   : undefined,
        required: false,
        label   : '',
        validate: true,
        visible : true,
        readonly: false,
        enable  : true,
        select  : [],
        timeout : 0,
        loading : false,
        retry   : 0,
        error   : undefined,
        help    : '',
        progress: 0,    
        onChange:()=>{},
        run     :()=>{},
        cancel  :()=>{}
    },props)  
}


export function createAutoFieldComponent<State extends Dict>(store: ReactAutoStore<State>,formCtx:React.MutableRefObject<AutoFormContext<State> | null>): React.MemoExoticComponent<AutoField<State>>{
    const { useComputed } = store
    return React.memo((props)=>{
        
        const { name } = props
        const prefix = `${name}.`
        
        const value = store.useAsyncState(name as any)

        const validate  = useComputed<boolean>(props.validate,{id:`${prefix}validate`,
            depends:[name],                          // 依赖<name>
            scope:name,        
            initial:true,
            throwError:false
        })  as ComputedObject<boolean>
        const required  = useComputed<boolean>(props.required,{id:`${prefix}required`,initial:false,throwError:false}) as ComputedObject<boolean> | undefined
        const visible   = useComputed<boolean>(props.visible,{id:`${prefix}visible`,initial:true,throwError:false})   as ComputedObject<boolean> | undefined
        const readonly  = useComputed<boolean>(props.readonly,{id:`${prefix}readonly`,initial:false,throwError:false}) as ComputedObject<boolean> | undefined
        const enable    = useComputed<boolean>(props.enable,{id:`${prefix}enable`,initial:true,throwError:false})     as ComputedObject<boolean> | undefined
        const select    = useComputed<any[]>(props.select,{id:`${prefix}select`,initial:[],throwError:false})       as ComputedObject<any[]> | undefined
        const help      = useComputed<string>(props.help,{id:`${prefix}help`,initial:'',throwError:false})          as ComputedObject<string> | undefined
        const label     = useComputed<string>(props.label,{id:`${prefix}label`,initial:'',throwError:false})        as ComputedObject<string> | undefined

        const fieldPropObjs = {
            validate,
            required,
            visible,
            readonly,
            enable,
            select,
            help,
            label
        } as Dict<ComputedObject<any> | undefined>

        const onChange = useCallback((e:React.ChangeEvent<HTMLInputElement>)=>{
            let inputValue = getInputValueFromEvent(e)            
            if(name){
                store.update(state => setVal(state, name.split(PATH_DELIMITER), inputValue));
            }            
            e.stopPropagation()
        },[name])
        
        const [ _,setRefresh ] = useState(0)

        const renderProps = useRef<AutoFieldRenderProps<State,any>>()
        if(!renderProps.current){
            renderProps.current=buildFieldRenderProps({
                name,
                validate: validate ? validate.val: pickValue<boolean>(props.validate as boolean,true),
                required: required ? required.val: pickValue<boolean>(props.required as boolean,false),
                visible : visible ? visible.val: pickValue<boolean>(props.visible as boolean,true),
                readonly: readonly ? readonly.val: pickValue<boolean>(props.readonly as boolean,false),
                enable  : enable ? enable.val:  pickValue<boolean>(props.enable as boolean,true),
                select  : select ? select.val: pickValue<any[]>(props.select as unknown as any[],[]),
                help    : help ? help.val: pickValue<string>(props.help as string,''),
                label   : label ? label.val: pickValue<string>(props.label as string,''),
                ...value, 
                error: validate?.error?.message ?? '',
                onChange
            }) as AutoFieldRenderProps<State,any>
        }  

        const getFieldPropObj = useCallback((path:string[]):[string | undefined,ComputedObject<any> | undefined]=>{
            const spath = path.join(PATH_DELIMITER)
            if(spath.startsWith("#"+prefix)){
                const [propKey] = spath.substring(("#"+prefix).length).split(PATH_DELIMITER)
                return  [propKey,fieldPropObjs[propKey]]
            }
            return [undefined,undefined]
        },[]) 

        useEffect(()=>{
            const watchers:Watcher[] =[]
            let count:number = 0
            watchers.push(store.on("computed:error",({path,error})=>{
                const [propKey,propObj] = getFieldPropObj(path)
                if(propObj && propKey){   
                    Object.assign(renderProps.current!,{error:error.message})      
                    setRefresh(++count)
                }
            }))
            watchers.push(store.watch(name,({value})=>{
                Object.assign(renderProps.current!,{value})
                setRefresh(++count)
            }))
            // 侦听所有字段计算属性的变化，当变化时，重新渲染字段
            watchers.push(store.watch(`#${name}.*`,({path,value})=>{
                const [propKey,propObj] = getFieldPropObj(path)
                if(propObj && propKey){
                    const updated:Dict  = {}
                    if(propObj.async && path[path.length-1] === 'value'){
                        Object.assign({[propKey]: value.value})
                    }else{
                        Object.assign({[propKey]:value})
                    }       
                    if(propKey === 'validate' && value === true){
                        updated.error = null
                    }
                    Object.assign(renderProps.current!,updated)
                    setRefresh(++count)                    
                }
            }))  
            return ()=>watchers.forEach(w=>w.off())
        },[])

        return <>{props.render(renderProps.current as any)}</>

    },()=>true)
}

//         //************************************* */


interface FieldProps<State extends Dict,
    T extends ObserverBuilder<boolean,State> = ObserverBuilder<boolean,State>>  {
    validate: T;
    render: (props: {validate:PickComputedResult2<T>}) => React.ReactNode;
  }
  

const Field = <
  State extends Dict,
  T extends ObserverBuilder<boolean,State>   = ObserverBuilder<boolean,State>  
>( { validate, render }: FieldProps<State,T>):React.ReactNode =>{ 
   
    return <>{render({validate:true } as any)}</>;

}


  <>
  <Field validate={()=>true} render={value => value ? <div>True</div> : <div>False</div>} />

  <Field validate={()=>true} render={value => value ? <div>True</div> : <div>False</div>} />
  <Field validate={computed(()=>true)} render={value => value ? <div>True</div> : <div>False</div>} />
  <Field validate={async ()=>true} render={value => value ? <div>True</div> : <div>False</div>} />
  <Field validate={computed(async ()=>true,[])} render={value => value ? <div>True</div> : <div>False</div>} />
  </>
// //************************************* */

 
 