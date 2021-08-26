import {
  AdminService,
  AkkaConnection,
  Auth,
  CommandService,
  ComponentId,
  LocationService,
  Prefix,
  Setup,
  TokenFactory
} from '@tmtsoftware/esw-ts'
import { Button, Input, Table, Typography } from 'antd'
import type { ColumnsType } from 'antd/lib/table'
import React, { useEffect, useState } from 'react'
import logo from '../../assets/images/tmt_logo.png'
import { useLocationService } from '../../contexts/LocationServiceContext'
import { useAuth } from '../../hooks/useAuth'
import { useQuery } from '../../hooks/useQuery'
import './Landing.css'

export const SubmitCommand = (): JSX.Element => {
  const [prefix, setPrefix] = useState<string>('')
  const [command, setCommand] = useState<string>('')
  const { auth } = useAuth()
  const componentId = new ComponentId(Prefix.fromString(prefix), 'HCD')

  const authData = { tokenFactory: () => auth?.token() }
  const {
    data: commandService,
    loading,
    error
  } = useQuery(() => CommandService(componentId, authData))

  if (auth === undefined) return <div>...loading</div>

  return (
    <div>
      <label>Prefix</label>
      <Input value={prefix} onChange={(e) => setPrefix(e.target.value)} />
      <label>Command</label>
      <Input value={command} onChange={(e) => setCommand(e.target.value)} />
      <Button
        disabled={prefix === '' || command === ''}
        onClick={() =>
          commandService?.submit(new Setup(Prefix.fromString(prefix), command))
        }>
        Submit
      </Button>
    </div>
  )
}

// const HeaderTitle = ({ title }: { title: string }): JSX.Element => (
//   <Typography.Title level={5} style={{ marginBottom: 0 }}>
//     {title}
//   </Typography.Title>
// )

// const columns: ColumnsType<Prefix> = [
//   {
//     title: <HeaderTitle title={'HCD'} />,
//     dataIndex: 'componentName',
//     key: 'componentName'
//   },
//   {
//     title: <HeaderTitle title={'Action'} />,
//     // eslint-disable-next-line react/display-name
//     render: (_, record) => <SubmitCommand prefix={record} />
//   }
// ]

// export const HCDTable = (): JSX.Element => {
//   const [hcds, setHcds] = useState<Set<Prefix>>(new Set())
//   const locationService = useLocationService()
//   const { auth } = useAuth()
//   const authData = { tokenFactory: () => auth?.token() }

//   const {
//     data: commandService,
//     loading,
//     error
//   } = useQuery(() => CommandService(componentId, authData))

//   useEffect(() => {
//     async function getHCDs(locationService: LocationService) {
//       console.log('in hcd table use effect')
//       const hcds = locationService
//         ? (await locationService.listByComponentType('HCD')).filter(
//             (h) => h.connection.connectionType === 'akka'
//           )
//         : []
//       setHcds(new Set([...hcds.map((h) => h.connection.prefix)]))
//     }
//     getHCDs(locationService)
//   }, [locationService])

//   return (
//     <Table
//       rowKey={(record) => record.componentName}
//       pagination={false}
//       dataSource={[...hcds]}
//       columns={columns}
//       bordered
//     />
//   )
// }
