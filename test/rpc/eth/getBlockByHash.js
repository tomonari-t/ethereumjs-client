const test = require('tape')

const { INVALID_PARAMS } = require('../../../lib/rpc/error-code')
const { baseSetup, params, baseRequest } = require('../helpers')
const { checkError } = require('../util')

const method = 'eth_getBlockByHash'

test(`${method}: call with valid arguments`, t => {
  const server = baseSetup()

  const req = params(method, [
    '0x910abca1728c53e8d6df870dd7af5352e974357dc58205dea1676be17ba6becf',
    true
  ])
  const expectRes = res => {
    let msg = 'should return the correct number'
    t.equal(res.body.result.number, 444444, msg)
  }
  baseRequest(t, server, req, 200, expectRes)
})

test(`${method}: call with false for second argument`, t => {
  const server = baseSetup()

  const req = params(method, [
    '0xdc0818cf78f21a8e70579cb46a43643f78291264dda342ae31049421c82d21ae',
    false
  ])
  const expectRes = res => {
    let msg = 'should return the correct number'
    t.equal(res.body.result.number, 444444, msg)
    msg = 'should return only the hashes of the transactions'
    t.equal(typeof (res.body.result.transactions[0]), 'string', msg)
  }
  baseRequest(t, server, req, 200, expectRes)
})

test(`${method}: call with invalid block hash without 0x`, t => {
  const server = baseSetup()

  const req = params(method, ['WRONG BLOCK NUMBER', true])
  const expectRes = checkError(
    t,
    INVALID_PARAMS,
    'invalid argument 0: hex string without 0x prefix'
  )
  baseRequest(t, server, req, 200, expectRes)
})

test(`${method}: call with invalid hex string as block hash`, t => {
  const server = baseSetup()

  const req = params(method, ['0xWRONG BLOCK NUMBER', true])
  const expectRes = checkError(
    t,
    INVALID_PARAMS,
    'invalid argument 0: invalid block hash'
  )
  baseRequest(t, server, req, 200, expectRes)
})

test('call eth_getBlockByHash without second parameter', t => {
  const server = baseSetup()

  const req = params(method, ['0x0'])
  const expectRes = checkError(
    t,
    INVALID_PARAMS,
    'missing value for required argument 1'
  )
  baseRequest(t, server, req, 200, expectRes)
})

test('call eth_getBlockByHash with invalid second parameter', t => {
  const server = baseSetup()

  const req = params(method, ['0x0', 'INVALID PARAMETER'])
  const expectRes = checkError(t, INVALID_PARAMS)
  baseRequest(t, server, req, 200, expectRes)
})
