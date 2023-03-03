import './App.css';
import { useReducer } from 'react';
import DigitButton from './DigitButton';
import OperationButton from './OperationButton';

export const actions={
  add_digit:'add-digit',
  choose_operation:'choose-operation',
  CLEAR:'clear',
  delete_digit:'delete-digit',
  Evaluate:'evaluate'
}

const reducer= (state,{type,payload})=>{
  switch(type){
    case actions.add_digit:
      if(state.overwrite){
        return{
          ...state,currentOperator:payload.digit,
          overwrite:false
        }
      }
      if(payload.digit==="0" && state.currentOperator==="0") return state
      if(payload.digit==="." && state.currentOperator.includes(".")) return state
      return {
        ...state,
        currentOperator:`${state.currentOperator || ''}${payload.digit}`
      }
    case actions.choose_operation:
      if(state.currentOperator==null && state.previousOperator==null) return state
      if(state.currentOperator==null){
        return{
          ...state,
          operator:payload.operation
        }
      }
      if(state.previousOperator== null){
        return{
          ...state,
          operator:payload.operation,
          previousOperator:state.currentOperator,
          currentOperator: null
        }
      }
      return {
        ...state,
        previousOperator: evaluate(state),
        operator: payload.operation,
        currentOperator: null
      }
    case actions.CLEAR:
      return {}
    case actions.delete_digit:
      if(state.overwrite){
        return{...state,
        overwrite:false,
        currentOperator:null}
      }
      if(state.currentOperator==null) return state
      if(state.currentOperator.length===1){
        return{
          ...state,currentOperator:null
        }
      }
      return{
        ...state,
        currentOperator: state.currentOperator.slice(0,-1)
      }
    case actions.Evaluate:

      if(state.operator==null || state.previousOperator== null || state.currentOperator==null) return state
      return{
        ...state,
        overwrite:true,
        previousOperator:null,
        currentOperator:evaluate(state),
        operator:null
      }
    default:
      return {}
  }
};

function evaluate({currentOperator,operator,previousOperator}){
  let a= parseFloat(previousOperator);
  let b= parseFloat(currentOperator);
  if(isNaN(a) || isNaN(b)) return ""
  
  switch(operator){
    case '+':
      return a+b;
    case '-':
      return a-b;
    case '/':
      if(b===0) throw console.error("invald input, divisor cannot be 0");
      return a/b;
    case '*':
      return a*b;
    default: 
      return ""
  }
}

const INTERGER_FORMATTER = new Intl.NumberFormat("en-us",{
  maximumFractionDigits:0,
})
function formatOperator(operand) {
  if(operand==null) return operand;
  const [interger,decimal] = String(operand).split(".");
  if(decimal==null) return INTERGER_FORMATTER.format(interger);
  return `${INTERGER_FORMATTER.format(interger)}.${decimal}`;
}

function App() {

  const [{currentOperator,operator,previousOperator},dispatch]= useReducer(reducer, {});

  return (
    <div className="App">
      <h2>Arthematic Calculator</h2>
      <table>
        <tr>
          <td colSpan={'4'} className='ot'><div className='pre'>{formatOperator(previousOperator)} {operator}</div><br/><br/><div className='output'>{formatOperator(currentOperator)}</div></td>
        </tr>
        <tr>
          <td colSpan={'2'} onClick={()=>dispatch({type: actions.CLEAR})}><button>AC</button></td>
          <td><button onClick={()=>dispatch({type:actions.delete_digit})}>Del</button></td>
          <td>
            <OperationButton operation="/" dispatch={dispatch}/>
          </td>
        </tr>
        <tr>
          <td><DigitButton digit="7" dispatch={dispatch}/></td>
          <td><DigitButton digit="8" dispatch={dispatch}/></td>
          <td><DigitButton digit="9" dispatch={dispatch}/></td>
          <td><OperationButton operation="*" dispatch={dispatch}/></td>
        </tr>
        <tr>
          <td><DigitButton digit="4" dispatch={dispatch}/></td>
          <td><DigitButton digit="5" dispatch={dispatch}/></td>
          <td><DigitButton digit="6" dispatch={dispatch}/></td>
          <td><OperationButton operation="-" dispatch={dispatch}/></td>
        </tr>
        <tr>
          <td><DigitButton digit="1" dispatch={dispatch}/></td>
          <td><DigitButton digit="2" dispatch={dispatch}/></td>
          <td><DigitButton digit="3" dispatch={dispatch}/></td>
          <td><OperationButton operation="+" dispatch={dispatch}/></td>
        </tr>
        <tr>
          <td colSpan={'2'}><DigitButton digit="0" dispatch={dispatch}/></td>
          <td><DigitButton digit="." dispatch={dispatch}/></td>
          <td><button onClick={()=>dispatch({type:actions.Evaluate})}>=</button></td>
        </tr>
      </table>
    </div>
  );
}

export default App;