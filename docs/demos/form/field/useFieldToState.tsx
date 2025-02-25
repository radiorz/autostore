import React from "react"
import { createStore } from '@autostorejs/react';
import { Button,Input,Layout, JsonView} from "x-react-components"

const { reset, useField,useReactive } = createStore({
  user:{
    firstName:"Zhang",
    lastName:"Fisher"
  }
})

export default ()=>{
    const [state] = useReactive()
    const fieldFirstName = useField<string>("user.firstName",{
        toState:(value)=>{
            return value.toUpperCase()
        }
    })
    const fieldLastName = useField<string>("user.lastName",{
        toState:(value)=>{
            return value.toUpperCase()
        }
    })
    return <Layout>    
        <div>
            <Input label="First Name" {...fieldFirstName}/>
            <Input label="last Name" {...fieldLastName} />       
            <Button onClick={()=>{
                reset()         
            }}>Reset</Button> 
        </div>
        <div>
            <JsonView  border={false} data={state}/>
        </div>
    </Layout>
}
