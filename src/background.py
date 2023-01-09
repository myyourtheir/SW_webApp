
# Нужно обратить внимание в продакшене на путь импорта этого модуля
import basic_functions as bf
import json

def calculate(Json):
    data = json.dumps(Json)
    return data
    

if __name__ =='__main__':
    js = {'pipeline': ['pipe', 'pump', 'pipe'], 
        'pipeParams': [[300, 500], [10, 700]], 
        'pumpParams': [[310, 6e-07, 1, 100, 20]], 
        'gateValveParams': []}
    print(calculate(js))

    