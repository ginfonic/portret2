import React from "react";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import SimpleBarChart from './simbleBarChart'
//import RadialBarChart from './RadialBarChart'
import PieChart from './PieChart'
import Axios from "axios";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import FormHelperText from "@material-ui/core/FormHelperText";

export default React.memo(function (props) {
    let {selected, tb_gosb, n} = props;

    const graphParameters = {
        'sameDep': [{type: 'tb_gosb', label: `Отклонений в ${tb_gosb === 'tb' ? 'ТБ' : 'ГОСБ'}`},
            {type: 'lvl', label: 'Отклонений на уровень'},
            {type: 'funcblock', label: 'Отклонений на функциональный блок'},
            {type: 'etalon', label: 'Отклонений на элемент эталонной структуры'}
        ],
        'match': [{type: 'error', label: 'Отклонений на тип ошибки'},
            {type: 'lvl', label: 'Отклонений на уровень'},
            {type: 'funcblock', label: 'Отклонений на функциональный блок'},
            {type: 'etalon', label: 'Отклонений на элемент эталонной структуры'},
        ],
        'matchUnit': [{type: 'error', label: 'Отклонений на тип ошибки'},
            {type: 'lvl', label: 'Отклонений на уровень'},
            {type: 'funcblock', label: 'Отклонений на функциональный блок'},
            {type: 'etalon', label: 'Отклонений на элемент эталонной структуры'},
        ],
        'count': [{type: 'tb_gosb', label: `Отклонений в ${tb_gosb === 'tb' ? 'ТБ' : 'ГОСБ'}`},
            {type: 'lvl', label: 'Отклонений на уровень'},
            {type: 'etalon', label: 'Отклонений на элемент эталонной структуры'},
            {type: 'funcblock', label: 'Отклонений на функциональный блок'},
        ],
        'urm': [{type: 'tb_gosb', label: `Отклонений в ${tb_gosb === 'tb' ? 'ТБ' : 'ГОСБ'}`},
            {type: 'lvl', label: 'Отклонений на уровень'},
            {type: 'etalon', label: 'Отклонений на элемент эталонной структуры'},
            {type: 'funcblock', label: 'Отклонений на функциональный блок'},
        ],
        'approved': [{type: 'tb', label: `Отклонений в ТБ`},
            {type: 'gosb', label: 'Отклонений в ГОСБ'},
            {type: 'time', label: 'Время рассмотрения запроса'},
            {type: 'tag', label: 'Тэг отклонения'}
        ],
        'global': [{type: 'global', label: `Всего ошибок`}
        ],
    };

    const [graphType, setGraphType] = React.useState('bc');
    const [parameter, setParameter] = React.useState(graphParameters[selected][(n % 10 - 1) < graphParameters[selected].length ? (n % 10 - 1) : 0]['type']);
    const [data, setData] = React.useState([]);

    React.useEffect(() => {
        if (parameter) {
            Axios.post('deviation_graphs/data', {selected, tb_gosb, parameter}).then((response) => {
                setData(response.data.data);
            });
        }
    }, [parameter, tb_gosb]);

    return <Card style={{height: '100%'}}>
        <CardHeader
            action={
                <div>
                    <FormControl fullWidth>
                        <Select value={graphType} onChange={(event) => setGraphType(event.target.value)}>
                            <MenuItem value={'bc'}>
                                Bar Chart
                            </MenuItem>
                            <MenuItem value={'pc'}>
                                Pie Chart
                            </MenuItem>
                        </Select>
                        <FormHelperText>Тип графика</FormHelperText>
                    </FormControl>
                    <FormControl fullWidth>
                        <Select value={parameter} onChange={(event) => setParameter(event.target.value)}>
                            {graphParameters[selected].map(item =>
                                <MenuItem value={item.type} key={`${n}_${item.type}`}>
                                    {item.label}
                                </MenuItem>
                            )}
                        </Select>
                        <FormHelperText>
                            Параметр построения графика
                        </FormHelperText>
                    </FormControl>
                </div>
            }
        />
        <CardContent>
            {graphType === 'bc' && parameter && data.length > 0 &&
            <SimpleBarChart data={data} n={n}/>
            }
            {graphType === 'pc' && parameter && data.length > 0 &&
            <PieChart data={data} n={n}/>
            }
        </CardContent>
    </Card>
})