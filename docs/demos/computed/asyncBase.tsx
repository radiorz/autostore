import React from 'react';
import { delay,createStore,computed  } from '@autostorejs/react';
import { Input,ColorBlock } from "x-react-components"

const { useAsyncReactive,useField } = createStore({
  user:{
    firstName:"Zhang",
    lastName:"fisher",
    fullName: computed(async (user)=>{
      await delay(1000)       // 模拟异步计算
      return user.firstName+' '+user.lastName  
    },
    ["user.firstName","./lastName"],{ // 指定依赖
      initial:"ZhangFisher"
    }) 
  }
},{
  id:"async-base", 
  debug:true // 打开Redux devtools
})

export default ()=>{ 
  const firstNameField =  useField("user.firstName") 
  const lastNameField =  useField("user.lastName")   
  const fullName = useAsyncReactive("user.fullName")   

  return <>
    <Input label="firstName" {...firstNameField} />
    <Input label="lastName" {...lastNameField} />
    <ColorBlock name="FullName" loading={fullName.loading}>{fullName.value}</ColorBlock>
    </>
}

